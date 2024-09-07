import { Body, Controller, Delete, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './utils/guards/LocalGuard';

@Controller('auth')
export class AuthController {
    constructor(@Inject('AUTH_SERVICE') private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(){
        return true
    }

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
