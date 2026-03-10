import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { UserService } from '../user/user.service';
import { HurtformService } from '../hurtform/hurtform.service';
import { WeekformService } from '../weekform/weekform.service';
import { YearformService } from '../yearform/yearform.service';
import {
  GoogleAccountAlreadyLinkedError,
  LineAccountAlreadyLinkedError,
  AccountAlreadyLinkedError,
} from './exceptions/AuthLinkingExceptions';

import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject('USER_SERVICE') private readonly userService: UserService,
    @Inject('HURTFORM_SERVICE')
    private readonly hurtformService: HurtformService,
    @Inject('WEEKFORM_SERVICE')
    private readonly weekformService: WeekformService,
    @Inject('YEARFORM_SERVICE')
    private readonly yearformService: YearformService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOne(
      await this.userService.findId(username),
    );
    if (!user) {
      return null;
    }
    const valid = await bcrypt.compare(password, user.password);
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
          password: 'third_party!@#$',
          name: profile.name,
          email: profile.email,
          role: Role.USER,
          reg_time: new Date(),
          userDetail: {
            create: {
              gender: null,
              birthday: '',
              age: 0,
              medical_History: '',
              address: '',
              phone: '',
              headshot: '0',
            },
          },
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
    try {
      const userId = await this.userService.findIdByLine(profile.userId);
      if (!userId) {
        const newUser = {
          username: profile.displayName,
          password: 'third_party!@#$',
          name: profile.displayName,
          email: null,
          role: Role.USER,
          lineId: profile.userId,
          reg_time: new Date(),
          userDetail: {
            create: {
              gender: null,
              birthday: '',
              age: 0,
              medical_History: '',
              address: '',
              phone: '',
              headshot: '0',
            },
          },
        };
        return await this.userService.create(newUser);
      }
      return await this.userService.findOne(userId);
    } catch (error) {
      console.error('Error in validateLineUser:', error);
      throw error;
    }
  }

  async linkGoogleAccount(user: any, profile: any): Promise<any> {
    // Check if the current user already has a Google account linked
    if (user.email && user.email !== profile.email) {
      throw new AccountAlreadyLinkedError('Google');
    }

    // Check if this Google account is already linked to another user
    const existingUserId = await this.userService.findIdByEmail(profile.email);
    if (existingUserId && existingUserId !== user.id) {
      throw new GoogleAccountAlreadyLinkedError(profile.email);
    }

    // Safe to link the Google account
    await this.userService.update(user.id, { email: profile.email });
  }

  async linkLineAccount(user: any, profile: any): Promise<any> {
    // Check if the current user already has a Line account linked
    if (user.lineId && user.lineId !== profile.userId) {
      throw new AccountAlreadyLinkedError('Line');
    }

    // Check if this Line account is already linked to another user
    const existingUserId = await this.userService.findIdByLine(profile.userId);
    if (existingUserId && existingUserId !== user.id) {
      throw new LineAccountAlreadyLinkedError(
        profile.displayName || profile.userId,
      );
    }

    // Safe to link the Line account
    await this.userService.update(user.id, { lineId: profile.userId });
  }

  async getUserById(userId: number) {
    return await this.userService.findOne(userId);
  }

  private mergeAccounts = async (newUserId: number, existingUserId: number) => {
    const forms = ['hurtform', 'Weekform', 'yearform'];
    const formServices = {
      hurtform: this.hurtformService,
      Weekform: this.weekformService,
      yearform: this.yearformService,
    };
    try {
      for (const form of forms) {
        const formService = formServices[form];
        const existingForms = (await formService.findMany(existingUserId)).data;
        if (existingForms) {
          for (const existingForm of existingForms) {
            await formService.updateUserId(existingForm.id, newUserId);
          }
        }
      }
    } catch (error) {
      console.error('Error in linkLineAccount:', error);
      throw error;
    }
    await this.userService.remove(existingUserId);
  };
}
