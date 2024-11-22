import { Module } from '@nestjs/common';
import { SttChineseController } from './stt-chinese.controller';
import { SttChineseService } from './stt-chinese.service';

@Module({
  controllers: [SttChineseController],
  providers: [SttChineseService],
})
export class SttChineseModule {}