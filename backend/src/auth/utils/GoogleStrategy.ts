import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, Inject } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { log } from 'console';

@Injectable()
export class GoogleLoginStrategy extends PassportStrategy(Strategy, 'google-login') {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_KEY,
      callbackURL: 'http://localhost:3000/auth/google/login/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      name: name.givenName
    }
    const login_user = await this.authService.validateGoogleUser(user);
    done(null, login_user);
  }
}

@Injectable()
export class GoogleLinkStrategy extends PassportStrategy(Strategy, 'google-link') {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_KEY,
      callbackURL: 'http://localhost:3000/auth/google/link/callback',
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(req: any, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      name: name.givenName
    }
    const currentUser = req.user;
    try {
      await this.authService.linkGoogleAccount(currentUser, user);
      req.query.status = 'Success'
    } catch (error) {
      // if (error.name.includes('Conflict')) {
      //   req.query.status = 'Conflict'
      // } else {
      req.query.status = 'Fail'
      console.log(error);
      // }
    }
    done(null, user);
  }
}