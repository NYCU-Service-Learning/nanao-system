import { Module } from '@nestjs/common';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { GeminiModule } from '../aiassistant/Aiassistant.module';
import { HurtformModule } from '../hurtform/hurtform.module';
import { MentalformModule } from '../mentalform/mentalform.module';
@Module({
  imports: [GeminiModule, HurtformModule, MentalformModule],
  controllers: [AnalysisController],
  providers: [AnalysisService]
})
export class AnalysisModule { }
