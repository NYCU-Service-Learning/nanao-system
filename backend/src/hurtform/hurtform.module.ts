import { Module } from '@nestjs/common';
import { HurtformService } from './hurtform.service';
import { HurtformController } from './hurtform.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [HurtformController],
  providers: [HurtformService],
})
export class HurtformModule {}