import { ConsoleLogger, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from 'src/user/user.service';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject('USER_SERVICE') private readonly userService: UserService
  ) {}

  async validateUser(username: string, password: string) {
    let user = await this.userService.findOne(await this.userService.findId(username));
    if (!user) {
      return null;
    }
    let valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return null;
    }
    return user;
  }

  async validateGoogleUser(profile: any): Promise<any> {
    try {
      const userId = await this.userService.findIdByEmail(profile.email);
      if (!userId) {
        const newUser = {
          username: profile.email,
          password: "third_party!@#$",
          name: profile.name,
          email: profile.email,
          role: Role.USER,
          reg_time: new Date(),
          userDetail: {
            create: {
                gender: null,
                birthday: "",
                age: 0,
                medical_History: "",
                address: "",
                phone: "",
                headshot: "0"
            }
          }
        };
        return await this.userService.create(newUser);
      } 
      return await this.userService.findOne(userId);
    } catch (error) {
      console.error('Error in validateGoogleUser:', error);
      throw error;
    }
  }
  async linkGoogleAccount(user: any, profile: any): Promise<any> {
    await this.userService.update(user.id, {email: profile.email})
  }
}
