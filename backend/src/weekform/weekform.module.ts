import { Module } from '@nestjs/common';
import { WeekformService } from './weekform.service';
import { WeekformController } from './weekform.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WeekformController],
  providers: [WeekformService],
})
export class WeekformModule {}
