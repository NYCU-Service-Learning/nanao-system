import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, Inject } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { getAuthConfig } from './AuthConfig';
import {
  AccountLinkingError,
  GoogleAccountAlreadyLinkedError,
  AccountAlreadyLinkedError,
} from '../exceptions/AuthLinkingExceptions';

@Injectable()
export class GoogleLoginStrategy extends PassportStrategy(
  Strategy,
  'google-login',
) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    const config = getAuthConfig();

    // Call super() first with appropriate configuration
    super({
      clientID: config.google.enabled ? config.google.clientId : 'dummy',
      clientSecret: config.google.enabled
        ? config.google.clientSecret
        : 'dummy',
      callbackURL: 'http://localhost:3000/auth/google/login/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      name: name.givenName,
    };
    const login_user = await this.authService.validateGoogleUser(user);
    done(null, login_user);
  }
}

@Injectable()
export class GoogleLinkStrategy extends PassportStrategy(
  Strategy,
  'google-link',
) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    const config = getAuthConfig();

    // Call super() first with appropriate configuration
    super({
      clientID: config.google.enabled ? config.google.clientId : 'dummy',
      clientSecret: config.google.enabled
        ? config.google.clientSecret
        : 'dummy',
      callbackURL: 'http://localhost:3000/auth/google/link/callback',
      scope: ['email', 'profile'],
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
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      name: name.givenName,
    };
    const currentUser = req.user;
    try {
      await this.authService.linkGoogleAccount(currentUser, user);
      req.query.status = 'Success';
    } catch (error) {
      if (error instanceof GoogleAccountAlreadyLinkedError) {
        req.query.status = 'GoogleAlreadyLinked';
      } else if (error instanceof AccountAlreadyLinkedError) {
        req.query.status = 'AccountAlreadyLinked';
      } else if (error instanceof AccountLinkingError) {
        req.query.status = 'LinkingError';
      } else {
        req.query.status = 'Fail';
      }
      console.log('Google linking error:', error.message);
    }
    done(null, user);
  }
}
