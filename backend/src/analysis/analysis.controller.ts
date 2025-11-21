// src/analysis/analysis.controller.ts
import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  ParseIntPipe, 
  ValidationPipe, 
  UsePipes,
  // 記得匯入您的 Guard
  // UseGuards 
} from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CleanBodyDto } from './dto/clean-body';
@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  // W2: 完善資料清洗 API
  @Post('clean')
  // 使用 ValidationPipe 進行結構和型別驗證
  clean(
    @Body(new ValidationPipe({ transform: true, whitelist: true })) 
    body: CleanBodyDto
  ) {
    return this.analysisService.clean(body);
  }

  // W3/W4: 整合 LLM 分析 HurtForm API
  // 建議加上 Guard 保護，確保只有登入者或管理者可以查詢
  // @UseGuards(AdminOrSameUserIdGuard) 
  @Get('hurtform/:userId')
  async analyzeHurtForms(@Param('userId', ParseIntPipe) userId: number) {
    // 預設分析最近 5 筆
    return await this.analysisService.analyzeUserHurtForms(userId, 5);
  }
}