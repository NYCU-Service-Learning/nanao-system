import { Injectable } from '@nestjs/common';
import { GeminiService } from '../aiassistant/Aiassistant.service';
import { HurtformService } from '../hurtform/hurtform.service';
import { MentalformService } from '../mentalform/mentalform.service';
import { CleanBodyDto } from './dto/clean-body';

@Injectable()
export class AnalysisService {
  constructor(
    private readonly llmService: GeminiService,
    private readonly hurtformService: HurtformService,
    private readonly mentalformService: MentalformService,
  ) {}

  // =========================================================
  // W3-W5: 身心健康綜合分析 (HurtForm + MentalForm)
  // =========================================================
  async analyzeUserHealth(userId: number, k: number = 5) {
    // 1. 【並行資料獲取】同時撈取身、心資料
    const [hurtForms, mentalForms] = await Promise.all([
      this.hurtformService.findLast_K(userId, k),
      this.mentalformService.findLast_K(userId, k),
    ]);

    const hasHurtData = hurtForms && hurtForms.length > 0;
    const hasMentalData = mentalForms && mentalForms.length > 0;

    if (!hasHurtData && !hasMentalData) {
      return {
        data_analyzed: { physical: 0, mental: 0 },
        message: '沒有足夠的資料進行分析',
        llm_response:
          '目前沒有任何身體或心理紀錄可供分析，請鼓勵使用者多加紀錄。',
      };
    }

    // 2. 【資料清洗與格式化】分別呼叫專屬的清洗函式
    const physicalDataPrompt = hasHurtData
      ? this.prepareHurtDataForLlm(hurtForms)
      : '無近期身體不適紀錄。';

    const mentalDataPrompt = hasMentalData
      ? this.prepareMentalDataForLlm(mentalForms)
      : '無近期心理狀況紀錄。';

    // 3. 【Prompt 組裝】
    const systemPrompt = `
      角色設定：你是一位駐台灣的資深社區健康照護員，專門服務年長者。語氣必須非常溫和、有耐心、使用親切且自然的繁體中文口吻。
      
      任務：請綜合分析該長輩的「身體不適紀錄」與「心理狀況紀錄」。
      
      分析策略：
      1. 若只有身體紀錄：專注分析疼痛趨勢與建議。
      2. 若只有心理紀錄：專注分析心情變化與關懷。
      3. **若兩者皆有**：請嘗試尋找關聯性（例如：是否因為身體疼痛導致心情不佳？或是心情焦慮導致身體緊繃？）。
      
      請確保你的輸出是**純 Markdown 格式**。
    `;

    const userContent = `
      以下是長輩的近期資料 (由新到舊)：
      
      === 身體不適紀錄 (Hurt Forms) ===
      ${JSON.stringify(physicalDataPrompt, null, 2)}
      
      === 心理狀況紀錄 (Mental Forms) ===
      ${JSON.stringify(mentalDataPrompt, null, 2)}
      
      請根據現有資料輸出 Markdown，包含以下標題 (若某部分無資料，請在該段落說明無資料即可)：
      ## 1. 整體狀況關懷
      ## 2. 身體與心理趨勢分析 (若兩者皆有，請分析關聯性)
      ## 3. 綜合健康建議 (在地化、溫和的建議)
      ## 4. 總結溫馨叮嚀
    `;

    // 4. 【呼叫 LLM】
    const llmResponse = await this.llmService.generateText(
      systemPrompt,
      userContent,
    );

    // 5. 【回傳結果】
    return {
      data_analyzed: {
        physical: hasHurtData ? hurtForms.length : 0,
        mental: hasMentalData ? mentalForms.length : 0,
      },
      llm_response: llmResponse,
    };
  }

  // =========================================================
  // W2: 使用者輸入資料清洗 (保持不變)
  // =========================================================
  clean(body: CleanBodyDto) {
    const isValid = this.validateCleaned(body);
    return {
      original: body,
      cleaned: body,
      is_valid: isValid,
      message: isValid ? 'Data cleaning completed.' : 'Data validation failed.',
    };
  }

  private validateCleaned(cleaned: CleanBodyDto): boolean {
    if (cleaned.email === '' || cleaned.age === null) return false;
    return true;
  }

  // =========================================================
  // 輔助函式：LLM 資料清洗與轉換區
  // =========================================================

  /**
   * 清洗 HurtForm 資料：移除 ID，格式化時間
   */
  private prepareHurtDataForLlm(recentForms: any[]): any[] {
    return recentForms.map((form) => {
      // 1. Extract metadata
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, user_id, fill_time, user, ...bodyParts } = form as any;

      // 2. Filter body parts with pain level > 0
      const painfulRecords = [];
      for (const [part, level] of Object.entries(bodyParts)) {
        if (typeof level === 'number' && level > 0) {
          painfulRecords.push(`${part}(${level})`);
        }
      }

      return {
        填寫時間: this.formatDate(fill_time),
        疼痛摘要:
          painfulRecords.length > 0 ? painfulRecords.join(', ') : '無不適',
      };
    });
  }

  /**
   * 清洗 MentalForm 資料：移除 ID，格式化時間，保留問題回答
   */
  private prepareMentalDataForLlm(recentForms: any[]): any[] {
    return recentForms.map((form) => {
      // 根據您的 MentalformService，這裡的欄位是 filled_time 和 problem (Array)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, user_id, filled_time, problem } = form as any;

      return {
        填寫時間: this.formatDate(filled_time),
        // 這裡直接傳送分數陣列，Gemini 能夠理解這是量表分數
        // 如果需要，也可以在這裡把 [1, 5, 2...] 轉成文字描述
        心理問卷分數: problem,
      };
    });
  }

  /**
   * 共用日期格式化工具：將 Date 物件轉為台灣習慣的中文格式
   */
  private formatDate(dateInput: any): string {
    if (!dateInput) return '無日期';
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);

    // 檢查是否為有效日期
    if (isNaN(date.getTime())) return String(dateInput);

    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
}
