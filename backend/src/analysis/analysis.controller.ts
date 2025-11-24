// src/analysis/analysis.controller.ts
import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  ParseIntPipe, 
  ValidationPipe, 

} from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CleanBodyDto } from './dto/clean-body';
@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('clean')
  // 使用 ValidationPipe 進行結構和型別驗證
  clean(
    @Body(new ValidationPipe({ transform: true, whitelist: true })) 
    body: CleanBodyDto
  ) {
    return this.analysisService.clean(body);
  }

  @Get('health/:userId') 
  async analyzeHealth(@Param('userId', ParseIntPipe) userId: number) {
    return await this.analysisService.analyzeUserHealth(userId, 5);
  }
}