import { Module, Global } from '@nestjs/common';
import { GeminiService } from './Aiassistant.service';

@Global()
@Module({
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule {}
