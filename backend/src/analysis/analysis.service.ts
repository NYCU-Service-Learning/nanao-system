// src/analysis/analysis.service.ts
import { Injectable } from '@nestjs/common';
import { GeminiService } from '../aiassistant/Aiassistant.service'; // 假設這是 LLM Service 的正確路徑
import { HurtformService } from '../hurtform/hurtform.service';
import { CleanBodyDto } from './dto/clean-body'; 

@Injectable()
export class AnalysisService {
  constructor(
    // 統一使用 llmService 作為屬性名稱
    private readonly llmService: GeminiService, 
    private readonly hurtformService: HurtformService, 
  ) {}


  async analyzeUserHurtForms(userId: number, k: number = 5) {
    // 1. 【資料獲取】從資料庫撈取最近 K 筆紀錄
    const recentForms = await this.hurtformService.findLast_K(userId, k);

    if (!recentForms || recentForms.length === 0) {
      return {
        data_analyzed: 0,
        message: '沒有足夠的資料進行分析',
        llm_response: '目前沒有紀錄可供分析，請鼓勵使用者多加紀錄。',
      };
    }

    // 2. 【資料清洗/格式化】呼叫專屬輔助函式，優化 LLM 輸入
    const dataForPrompt = this.prepareDataForLlm(recentForms);

    // 3. 【Prompt 組裝】定義角色和資料
    const systemPrompt = `
      角色設定：你是一位駐台灣的資深社區健康照護員，專門服務年長者。語氣必須非常溫和、有耐心、使用親切且自然的繁體中文口吻。請避免使用過於複雜或西方的專業術語。
      
      任務：請分析以下使用者（年長者）最近 ${recentForms.length} 筆的身體不適紀錄 (Hurt Forms)，並根據以下結構輸出 Markdown 內容。
      
      請確保你的輸出是**純 Markdown 格式**。
    `;
    
    const userContent = `
      以下是使用者的資料 (請根據填寫時間由新到舊分析)：
      ${JSON.stringify(dataForPrompt, null, 2)}
      
      ## 1. 狀況關心與趨勢提醒
      ## 2. 可能原因的溫和推測
      ## 3. 在地化的復健與舒緩建議
      ## 4. 總結溫馨叮嚀
    `;

    // 4. 【呼叫 LLM】使用 this.llmService
    const llmResponse = await this.llmService.generateText(systemPrompt, userContent);

    // 5. 【回傳前端】
    return {
      data_analyzed: recentForms.length,
      llm_response: llmResponse, 
    };
  }

  // =========================================================
  // W2: 資料清洗功能 (簡化版，依賴 DTO @Transform)
  // =========================================================
  clean(body: CleanBodyDto) {
    // 由於 DTO 的 @Transform 已經完成了大部分清洗工作，這裡只做驗證和回傳
    const isValid = this.validateCleaned(body); 

    return {
      original: body, 
      cleaned: body, 
      is_valid: isValid,
      message: isValid ? 'Data cleaning and normalization completed via DTO transformation.' : 'Data validation failed on key fields.',
    };
  }
  
  // 驗證清洗後的資料
  private validateCleaned(cleaned: CleanBodyDto): boolean {
    // 假設 Email 和 Age 是必填/必須有效的欄位
    if (cleaned.email === '' || cleaned.age === null || cleaned.age === undefined) return false; 
    return true;
  }

  // =========================================================
  // 輔助函式：LLM 專屬資料序列化
  // =========================================================
  /**
   * 將 HurtForm 資料庫物件轉換為 LLM 友善的格式
   * @param recentForms 原始資料庫物件陣列
   */
  private prepareDataForLlm(recentForms: any[]): any[] {
    return recentForms.map((form) => {
      // 1. 過濾系統欄位
      const { id, user_id, ...rest } = form as any; 
      
      // 2. 格式化時間，讓 LLM 閱讀
      const filledTime = rest.fill_time instanceof Date 
                           ? rest.fill_time.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                           : rest.fill_time;
      
      // 3. 返回 LLM 友善的中文鍵值對 (這是傳給 LLM 的清洗版本)
      return {
          填寫時間: filledTime,
          疼痛部位: rest.title,
          疼痛程度: rest.pain_level,
          詳細描述: rest.description,
          // 如果還有其他欄位，請在這裡添加
      };
    });
  }
}