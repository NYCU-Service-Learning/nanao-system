import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../database/database.module';
import { UserService } from '../user/user.service';
import { LocalStrategy } from './utils/LocalStrategy';
import { SessionSerializer } from './utils/SessionSerializer';
import { DatabaseService } from '../database/database.service';
import {
  GoogleLinkStrategy,
  GoogleLoginStrategy,
} from './utils/GoogleStrategy';
import { HurtformService } from '../hurtform/hurtform.service';
import { WeekformService } from '../weekform/weekform.service';
import { YearformService } from '../yearform/yearform.service';
import { LineLoginStrategy } from './utils/LineStrategy';
import { LineLinkStrategy } from './utils/LineStrategy';

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    {
      provide: 'USER_SERVICE',
      useClass: UserService,
    },
    {
      provide: 'DATABASE_SERVICE',
      useClass: DatabaseService,
    },
    {
      provide: 'HURTFORM_SERVICE',
      useClass: HurtformService,
    },
    {
      provide: 'WEEKFORM_SERVICE',
      useClass: WeekformService,
    },
    {
      provide: 'YEARFORM_SERVICE',
      useClass: YearformService,
    },
    LocalStrategy,
    SessionSerializer,
    GoogleLinkStrategy,
    GoogleLoginStrategy,
    LineLoginStrategy,
    LineLinkStrategy,
  ],
})
export class AuthModule {}
