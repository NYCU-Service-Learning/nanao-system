import {
  Controller,
  Query,
  Get,
  Inject,
  Post,
  Request,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedGuard, LocalAuthGuard } from './utils/guards/LocalGuard';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './utils/guards/GoogleGuard';
import { LineAuthGuard } from './utils/guards/LineGuard';
import {
  GoogleAuthEnabledGuard,
  LineLoginAuthEnabledGuard,
  LineLinkAuthEnabledGuard,
} from './utils/guards/ThirdPartyAuthGuard';
import { getAuthConfig } from './utils/AuthConfig';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login() {
    return true;
  }

  @Get('google/login')
  @UseGuards(GoogleAuthEnabledGuard, GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/login/callback')
  @UseGuards(GoogleAuthEnabledGuard, GoogleAuthGuard)
  async googleAuthRedirect(
    @Query('error') error: string,
    @Request() req,
    @Res() res: Response,
  ) {
    if (error === 'access_denied') {
      return res.redirect('http://localhost:5173/login?googleLogin=failed');
    }
    try {
      if (req.user) {
        req.session.user = req.user;
        await req.session.save();
        res.cookie('user', req.user.username, {
          maxAge: 60 * 60 * 1000, // 1 hour
          httpOnly: false,
          secure: false,
          path: '/',
          sameSite: 'lax',
        });

        return res.redirect(
          `http://localhost:5173/login?googleLogin=success&username=${encodeURIComponent(req.user.username)}`,
        );
      }
      return res.redirect('http://localhost:5173/login?googleLogin=failed');
    } catch (error) {
      console.error('Google callback error:', error);
      return res.redirect('http://localhost:5173/login?googleLogin=error');
    }
  }

  @Get('line/login')
  @UseGuards(LineLoginAuthEnabledGuard, LineAuthGuard)
  async lineAuth() {}

  @Get('line/login/callback')
  @UseGuards(LineLoginAuthEnabledGuard, LineAuthGuard)
  async lineAuthRedirect(
    @Query('error') error: string,
    @Request() req,
    @Res() res: Response,
  ) {
    if (error === 'access_denied') {
      return res.redirect('http://localhost:5173/login?lineLogin=failed');
    }
    console.log(error);
    try {
      if (req.user) {
        req.session.user = req.user;
        await req.session.save();
        res.cookie('user', req.user.username, {
          maxAge: 60 * 60 * 1000, // 1 hour
          httpOnly: false,
          secure: false,
          path: '/',
          sameSite: 'lax',
        });
        return res.redirect(
          `http://localhost:5173/login?lineLogin=success&username=${encodeURIComponent(req.user.username)}`,
        );
      }
      return res.redirect('http://localhost:5173/login?lineLogin=failed');
    } catch (error) {
      console.error('Line callback error:', error);
      return res.redirect('http://localhost:5173/login?lineLogin=error');
    }
  }

  @Get('status')
  async checkLoginStatus(@Request() req, @Res() res: Response) {
    if (req.session.user) {
      return res.json({
        status: 'success',
        user: {
          username: req.session.user.username,
        },
      });
    }
    return res.json({
      status: 'error',
      message: 'Not logged in',
    });
  }

  @Get('config')
  async getAuthConfig(@Res() res: Response) {
    const config = getAuthConfig();
    return res.json({
      auth: {
        local: true, // Local authentication is always available
        google: config.google.enabled,
        lineLogin: config.line.login.enabled,
        lineLink: config.line.link.enabled,
      },
    });
  }

  @Get('linked-accounts')
  async getLinkedAccounts(@Request() req, @Res() res: Response) {
    // Check both authentication patterns
    const user = req.session.user || req.user;

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Not authenticated',
      });
    }

    // Get the full user data to check linked accounts
    const fullUser = await this.authService.getUserById(user.id);

    return res.json({
      status: 'success',
      linkedAccounts: {
        google: !!fullUser?.email,
        line: !!fullUser?.lineId,
      },
      accountInfo: {
        googleEmail: fullUser?.email || null,
        lineId: fullUser?.lineId || null,
      },
    });
  }

  @Get('google/link')
  @UseGuards(
    AuthenticatedGuard,
    GoogleAuthEnabledGuard,
    AuthGuard('google-link'),
  )
  async googleLink() {}

  @Get('google/link/callback')
  @UseGuards(
    AuthenticatedGuard,
    GoogleAuthEnabledGuard,
    AuthGuard('google-link'),
  )
  async googleLinkRedirect(@Request() req, @Res() res: Response) {
    const status = req.query.status;
    return res.redirect(`http://localhost:5173/profile?googleLink=${status}`);
  }

  @Get('line/link')
  @UseGuards(
    AuthenticatedGuard,
    LineLinkAuthEnabledGuard,
    AuthGuard('line-link'),
  )
  async lineLink() {}

  @Get('line/link/callback')
  @UseGuards(
    AuthenticatedGuard,
    LineLinkAuthEnabledGuard,
    AuthGuard('line-link'),
  )
  async lineLinkRedirect(@Request() req, @Res() res: Response) {
    const status = req.query.status;
    return res.redirect(`http://localhost:5173/profile?lineLink=${status}`);
  }

  @Post('logout')
  logout(@Request() req) {
    req.logout((err) => {
      if (err) {
        throw err;
      }
    });
    return 'logout succeeded';
  }
}
