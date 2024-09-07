import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HurtformModule } from './hurtform/hurtform.module';
import { YearformModule } from './yearform/yearform.module';
import { WeekformModule } from './weekform/weekform.module';
import { UserModule } from './user/user.module';
import { UserDetailModule } from './user-detail/user-detail.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import configuration from 'config/configuration';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
    DatabaseModule, 
    HurtformModule, 
    YearformModule, 
    WeekformModule, 
    UserModule, 
    UserDetailModule, 
    AuthModule,
    ConfigModule.forRoot({isGlobal:true, load:[configuration],}), 
    PassportModule.register({
      session: true
    }),
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 1000,
      limit: 10,
    },{
      name: 'long',
      ttl: 60000,
      limit: 100,
    }])
  ],
  controllers: [AppController],
  providers: [AppService, 
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}
