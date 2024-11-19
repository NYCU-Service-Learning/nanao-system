import { Body, Controller, Delete, Get, Inject, Post, Request, UseGuards, Res, Redirect } from '@nestjs/common';
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
    async googleAuth(@Request() req){}

    @Get('google/login/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Request() req){
        return true;
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
