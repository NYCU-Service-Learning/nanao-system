import { Controller, Post, Delete, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './utils/guards/LocalGuard';
import { AuthenticatedUser } from './auth.interfaces';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req){
        const user: AuthenticatedUser = req.user;
        return { id: user.id, username: user.username, role: user.role };
    }

    @Delete('logout')
    logout(@Request() req){
        req.logout((err) => {
            if(err){
                throw err;
            }
        });
        return { message: 'logout succeeded' };
    }

    @Get('verify')
    verify(@Request() req){
        if(req.isAuthenticated()){
            const user: AuthenticatedUser = req.user;
            return { id: user.id, username: user.username, role: user.role };
        }
        return { message: 'Unauthorized' };
    }
}
