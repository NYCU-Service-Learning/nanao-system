import { ConsoleLogger, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from 'src/user/user.service';
import { HurtformService } from 'src/hurtform/hurtform.service';
import { WeekformService } from 'src/weekform/weekform.service';
import { YearformService } from 'src/yearform/yearform.service';

import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject('USER_SERVICE') private readonly userService: UserService,
    @Inject('HURTFORM_SERVICE') private readonly HurtformService: HurtformService,
    @Inject('WEEKFORM_SERVICE') private readonly WeekformService: WeekformService,
    @Inject('YEARFORM_SERVICE') private readonly YearformService: YearformService
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

  async validateLineUser(profile: any): Promise<any> {
    console.log(profile);
  }

  async linkGoogleAccount(user: any, profile: any): Promise<any> {
    // TODO: check if the email is already used by another account
    // if yes, merge two accounts
    const existingUser = await this.userService.findOne(await this.userService.findIdByEmail(profile.email));
    if(existingUser.id != user.id){
      // merge two accounts
      // Note: emotion form should be add when merge to main branch
      
      const forms = ['hurtform', 'Weekform', 'yearform'];
      const formServices = {
        hurtform: this.HurtformService,
        Weekform: this.WeekformService,
        yearform: this.YearformService
      };
      try{
        for (const form of forms) {
          const formService = formServices[form];
          const existingForms = (await formService.findMany(existingUser.id)).data;
          if (existingForms) {
            for (const existingForm of existingForms) {
              await formService.updateUserId(existingForm.id, user.id);
            }
          }
        }
      } catch (error) {
        console.error('Error in linkGoogleAccount:', error);
        throw error;
      }
      await this.userService.remove(existingUser.id);
    }
    await this.userService.update(user.id, {email: profile.email})
  }

  async linkLineAccount(user: any, profile: any): Promise<any> {
    console.log(user);
    console.log(profile);
  }
}
