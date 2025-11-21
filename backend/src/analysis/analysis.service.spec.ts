import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisService } from './analysis.service';
import { GeminiService } from '../aiassistant/Aiassistant.service';

// 1. 建立 LlmService 的 Mock，這樣就不會真的去呼叫 Google
const mockLlmService = {
  generateText: jest.fn(),
};

describe('AnalysisService', () => {
  let service: AnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalysisService,
        // 使用 useValue 注入我們的 Mock 物件
        { provide: GeminiService, useValue: mockLlmService },
      ],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);
    mockLlmService.generateText.mockClear();
  });

  // --- 測試純清洗邏輯 (無需 LLM) ---
  describe('clean()', () => {
    it('should clean name, email, and tags correctly', () => {
      const input = {
        name: '  jason  BOURNE ',
        email: '  Jason@CIA.gov  ',
        age: '32',
        tags: ['SPY', 'Action', null, 'spy'],
      };

      const result = service.clean(input);

      expect(result.cleaned).toEqual({
        name: 'Jason Bourne',      // 驗證大小寫修正
        email: 'jason@cia.gov',    // 驗證小寫
        age: 32,                   // 驗證轉數字
        tags: ['spy', 'action'],   // 驗證去重和小寫
      });
    });

    it('should handle invalid data', () => {
      const input = { name: null, email: 'not-an-email', age: 'abc' };
      const result = service.clean(input);
      
      expect(result.cleaned.name).toBe('');
      expect(result.cleaned.email).toBe('');
      expect(result.cleaned.age).toBeNull();
    });
  });

  // --- 測試整合邏輯 (需要 LLM) ---
  describe('cleanAndGenerate()', () => {
    it('should clean data then call LLM service', async () => {
      const input = { name: 'Alice' };
      // 設定 LLM Mock 回傳
      mockLlmService.generateText.mockResolvedValue('Hello Alice!');

      const result = await service.cleanAndGenerate(input);

      // 1. 驗證 LlmService 有被呼叫
      expect(mockLlmService.generateText).toHaveBeenCalled();
      // 2. 驗證參數裡面包含清洗後的資料 (檢查字串包含)
      expect(mockLlmService.generateText).toHaveBeenCalledWith(
        expect.stringContaining('"name":"Alice"')
      );
      // 3. 驗證最終結果包含 LLM 的回應
      expect(result.llm).toBe('Hello Alice!');
    });
  });
});