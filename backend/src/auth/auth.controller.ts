import { Body, Controller, Delete, Get, Inject, Post, Request, UseGuards, Res, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminOrSameUserIdGuard, AuthenticatedGuard, LocalAuthGuard } from './utils/guards/LocalGuard';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(){
        return true
    }

    @Get('google/login')
    @UseGuards(AuthGuard('google-login'))
    async googleAuth(@Request() req){}

    @Get('google/login/callback')
    @UseGuards(AuthGuard('google-login'))
    async googleAuthRedirect(@Request() req){}

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
