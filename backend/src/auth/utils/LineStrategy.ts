import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-oauth2';
import { Injectable, Inject } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { log } from 'console';
import axios from 'axios';
import passport from 'passport';

const getUserProfile = async (accessToken: string) => {
  try {
      const response = await axios.get('https://api.line.me/v2/profile', {
          headers: {
              'Authorization': `Bearer ${accessToken}`
          }
      });
      return response.data;
  } catch (error) {
      console.error('Error getting user profile:', error.response ? error.response.data : error.message);
      throw error;
  }
};

@Injectable()
export class LineLoginStrategy extends PassportStrategy(Strategy, 'line-login') {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService) {
    super({
      clientID: process.env.LINE_LOGIN_CHANNEL_ID,
      clientSecret: process.env.LINE_LOGIN_SECRET_KEY,
      callbackURL: 'http://localhost:3000/auth/line/login/callback',
      authorizationURL: 'https://access.line.me/oauth2/v2.1/authorize?response_type=code&state=login',
      tokenURL: 'https://api.line.me/oauth2/v2.1/token',
      scope: ['profile', 'openid'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const user_profile = await getUserProfile(accessToken);
    const login_user = await this.authService.validateLineUser(user_profile);
    done(null, login_user);
  }
}

@Injectable()
export class LineLinkStrategy extends PassportStrategy(Strategy, 'line-link') {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService) {
    super({
      clientID: process.env.LINE_LINK_CHANNEL_ID,
      clientSecret: process.env.LINE_LINK_SECRET_KEY,
      callbackURL: 'http://localhost:3000/auth/line/link/callback',
      authorizationURL: 'https://access.line.me/oauth2/v2.1/authorize?response_type=code&state=login',
      tokenURL: 'https://api.line.me/oauth2/v2.1/token',
      scope: ['profile', 'openid'],
      passReqToCallback: true,
    });
  }

  async validate(req: any, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const user_profile = await getUserProfile(accessToken);
    const currentUser = req.user;
    try{
      await this.authService.linkLineAccount(currentUser, user_profile);
      req.query.status = 'Success'
    } catch (error) {
      req.query.status = 'Fail'
      console.log(error);
    } 
    done(null, user_profile);
  }
}