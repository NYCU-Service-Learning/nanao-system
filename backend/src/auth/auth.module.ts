import { Module, DynamicModule } from '@nestjs/common';
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
import { getAuthConfig } from './utils/AuthConfig';
import {
  GoogleAuthEnabledGuard,
  LineLoginAuthEnabledGuard,
  LineLinkAuthEnabledGuard,
} from './utils/guards/ThirdPartyAuthGuard';

@Module({})
export class AuthModule {
  static forRoot(): DynamicModule {
    const authConfig = getAuthConfig();

    // Base providers that are always needed
    const baseProviders = [
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
      GoogleAuthEnabledGuard,
      LineLoginAuthEnabledGuard,
      LineLinkAuthEnabledGuard,
    ];

    // Conditionally add third-party authentication strategies
    const conditionalProviders = [];

    if (authConfig.google.enabled) {
      conditionalProviders.push(GoogleLoginStrategy, GoogleLinkStrategy);
      console.log('Google authentication enabled');
    } else {
      console.log(
        'Google authentication disabled - missing environment variables',
      );
    }

    if (authConfig.line.login.enabled) {
      conditionalProviders.push(LineLoginStrategy);
      console.log('Line login authentication enabled');
    } else {
      console.log(
        'Line login authentication disabled - missing environment variables',
      );
    }

    if (authConfig.line.link.enabled) {
      conditionalProviders.push(LineLinkStrategy);
      console.log('Line link authentication enabled');
    } else {
      console.log(
        'Line link authentication disabled - missing environment variables',
      );
    }

    return {
      module: AuthModule,
      imports: [DatabaseModule],
      controllers: [AuthController],
      providers: [...baseProviders, ...conditionalProviders],
    };
  }
}
