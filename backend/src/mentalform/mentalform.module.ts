import { Module } from '@nestjs/common';
import { MentalformController } from './mentalform.controller';
import { MentalformService } from './mentalform.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [MentalformController],
  providers: [MentalformService],
  exports: [MentalformService],
})
export class MentalformModule {}
