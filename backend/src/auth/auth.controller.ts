import { Body, Controller, Delete, Query, Get, Inject, Post, Request, UseGuards, Res, Redirect } from '@nestjs/common';
import { query, Response } from 'express';
import { AuthService } from './auth.service';
import { AdminOrSameUserIdGuard, AuthenticatedGuard, LocalAuthGuard } from './utils/guards/LocalGuard';
import { AuthGuard } from '@nestjs/passport';
import { GoogleAuthGuard } from './utils/guards/GoogleGuard';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(){
    return true
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Request() req) {}

  @Get('google/login/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Query('error') error: string, @Request() req, @Res() res: Response) {
    if (error === 'access_denied') {
      return res.redirect('http://localhost:5173/login?googleLogin=failed');
    }
    try {
      if (req.user){
        req.session.user = req.user;
        await req.session.save(); 
        res.cookie('user', req.user.username, {
          maxAge: 60 * 60 * 1000, // 1 hour
          httpOnly: false,
          secure: false,
          path: '/',
          sameSite: 'lax'
        });

        return res.redirect(`http://localhost:5173/login?googleLogin=success&username=${encodeURIComponent(req.user.username)}`);
      }
      return res.redirect('http://localhost:5173/login?googleLogin=failed');
    } catch (error) {
      console.error('Google callback error:', error);
      return res.redirect('http://localhost:5173/login?googleLogin=error');
    }
  }

  @Get('status')
  async checkLoginStatus(@Request() req, @Res() res: Response) {
    if (req.session.user) {
      return res.json({
        status: 'success',
        user: {
          username: req.session.user.username
        }
      });
    }
    return res.json({
      status: 'error',
      message: 'Not logged in'
    });
  }
  
  @Get('google/link')
  @UseGuards(AuthenticatedGuard, AuthGuard('google-link'))
  async googleLink(@Request() req){}

  @Get('google/link/callback')
  @UseGuards(AuthenticatedGuard, AuthGuard('google-link'))
  async googleLinkRedirect(@Request() req){}

  @Delete('logout')
  logout(@Request() req){
      req.logout((err) => {
          if(err){
              throw err
          }
      });
      return 'logout succeeded'
  }
}
