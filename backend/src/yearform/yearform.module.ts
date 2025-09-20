import { Module } from '@nestjs/common';
import { YearformService } from './yearform.service';
import { YearformController } from './yearform.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [YearformController],
  providers: [YearformService],
})
export class YearformModule {}
