import { Module } from '@nestjs/common';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { GeminiService } from '../aiassistant/Aiassistant.service';
import { HurtformModule } from '../hurtform/hurtform.module'; 
import { MentalformModule } from '../mentalform/mentalform.module';
@Module({
  imports: [GeminiService, HurtformModule, MentalformModule], 
  controllers: [AnalysisController],
  providers: [AnalysisService]
})
export class AnalysisModule {}
