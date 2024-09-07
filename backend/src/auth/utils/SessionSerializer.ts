import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport"
import { User } from "@prisma/client";
import { DatabaseService } from "src/database/database.service";

export class SessionSerializer extends PassportSerializer{
    constructor(
        @Inject('DATABASE_SERVICE') private readonly databaseService: DatabaseService,
    ) {
        super()
    }

    serializeUser(user: User, done: (err, user: number) => void) {
        done(null, user.id);
    }
    async deserializeUser(userId: number, done: (err, user: User) => void) {
        let userDB = await this.databaseService.user.findUnique({
            where: {
                id: userId
            }
        })
        if(!userDB){
            return done(new HttpException('user not found', HttpStatus.BAD_REQUEST), null)
        }else{
            return done(null, userDB)
        }
    }
}