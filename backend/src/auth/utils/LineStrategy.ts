import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-oauth2';
import { Injectable, Inject } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { getAuthConfig } from './AuthConfig';
import {
  AccountLinkingError,
  LineAccountAlreadyLinkedError,
  AccountAlreadyLinkedError,
} from '../exceptions/AuthLinkingExceptions';
import axios from 'axios';

const getUserProfile = async (accessToken: string) => {
  try {
    const response = await axios.get('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      'Error getting user profile:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

@Injectable()
export class LineLoginStrategy extends PassportStrategy(
  Strategy,
  'line-login',
) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    const config = getAuthConfig();

    // Call super() first with appropriate configuration
    super({
      clientID: config.line.login.enabled
        ? config.line.login.channelId
        : 'dummy',
      clientSecret: config.line.login.enabled
        ? config.line.login.secretKey
        : 'dummy',
      callbackURL: 'http://localhost:3000/auth/line/login/callback',
      authorizationURL:
        'https://access.line.me/oauth2/v2.1/authorize?response_type=code&state=login',
      tokenURL: 'https://api.line.me/oauth2/v2.1/token',
      scope: ['profile', 'openid'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const user_profile = await getUserProfile(accessToken);
    const login_user = await this.authService.validateLineUser(user_profile);
    done(null, login_user);
  }
}

@Injectable()
export class LineLinkStrategy extends PassportStrategy(Strategy, 'line-link') {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    const config = getAuthConfig();

    // Call super() first with appropriate configuration
    super({
      clientID: config.line.link.enabled ? config.line.link.channelId : 'dummy',
      clientSecret: config.line.link.enabled
        ? config.line.link.secretKey
        : 'dummy',
      callbackURL: 'http://localhost:3000/auth/line/link/callback',
      authorizationURL:
        'https://access.line.me/oauth2/v2.1/authorize?response_type=code&state=login',
      tokenURL: 'https://api.line.me/oauth2/v2.1/token',
      scope: ['profile', 'openid'],
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const user_profile = await getUserProfile(accessToken);
    const currentUser = req.user;
    try {
      await this.authService.linkLineAccount(currentUser, user_profile);
      req.query.status = 'Success';
    } catch (error) {
      if (error instanceof LineAccountAlreadyLinkedError) {
        req.query.status = 'LineAlreadyLinked';
      } else if (error instanceof AccountAlreadyLinkedError) {
        req.query.status = 'AccountAlreadyLinked';
      } else if (error instanceof AccountLinkingError) {
        req.query.status = 'LinkingError';
      } else {
        req.query.status = 'Fail';
      }
      console.log('Line linking error:', error.message);
    }
    done(null, user_profile);
  }
}
