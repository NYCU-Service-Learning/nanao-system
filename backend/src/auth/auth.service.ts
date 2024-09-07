import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { session } from 'passport';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly databaseService: DatabaseService,
        @Inject('USER_SERVICE') private readonly userService: UserService){}
    
    
    async validateUser(username: string, password: string){
        let user = await this.userService.findOne(await this.userService.findId(username));
        if(!user){
            return null;
        }
        let valid = await bcrypt.compare(password, user.password)
        if(!valid){
            return null;
        }
        return user
    }
}
