import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserService } from 'src/user/user.service';
import { LocalStrategy } from './utils/LocalStrategy';
import { SessionSerializer } from './utils/SessionSerializer';
import { DatabaseService } from 'src/database/database.service';

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
      useClass: DatabaseService
    },
    LocalStrategy,
    SessionSerializer
  ],
})
export class AuthModule {}
