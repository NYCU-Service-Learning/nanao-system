// app.module.ts
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HurtformModule } from './hurtform/hurtform.module';
import { YearformModule } from './yearform/yearform.module';
import { WeekformModule } from './weekform/weekform.module';
import { UserModule } from './user/user.module';
import { UserDetailModule } from './user-detail/user-detail.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import configuration from 'config/configuration';
// import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';

@Module({
  imports: [
    DatabaseModule, 
    HurtformModule, 
    YearformModule, 
    WeekformModule, 
    UserModule, 
    UserDetailModule, 
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }), 
    PassportModule.register({
      session: true
    }),
    // ThrottlerModule.forRoot([
    //   {
    //     name: 'short',
    //     ttl: 1000,
    //     limit: 10,
    //   },
    //   {
    //     name: 'long',
    //     ttl: 60000,
    //     limit: 100,
    //   },
    // ])
  ],
  controllers: [AppController],
  providers: [AppService, 
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // }
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}
  
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: this.configService.get<string>('SESSION_SECRET'), // 使用環境變量
          resave: false,
          saveUninitialized: false,
          cookie: {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production', // 生產環境中設為 true
            maxAge: 3600000, // 1 小時
            sameSite: 'strict',
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
