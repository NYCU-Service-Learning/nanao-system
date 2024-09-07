import { Module } from '@nestjs/common';
import { UserDetailService } from './user-detail.service';
import { UserDetailController } from './user-detail.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports:[DatabaseModule],
  controllers: [UserDetailController],
  providers: [UserDetailService],
})
export class UserDetailModule {}
