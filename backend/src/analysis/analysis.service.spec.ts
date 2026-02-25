import { Test, TestingModule } from '@nestjs/testing';
import { AnalysisService } from './analysis.service';
import { GeminiService } from '../aiassistant/Aiassistant.service';
import { HurtformService } from '../hurtform/hurtform.service';
import { MentalformService } from '../mentalform/mentalform.service';

const mockLlmService = {
  generateText: jest.fn(),
};

const mockHurtformService = {
  findLast_K: jest.fn(),
};

const mockMentalformService = {
  findLast_K: jest.fn(),
};

describe('AnalysisService', () => {
  let service: AnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalysisService,
        { provide: GeminiService, useValue: mockLlmService },
        { provide: HurtformService, useValue: mockHurtformService },
        { provide: MentalformService, useValue: mockMentalformService },
      ],
    }).compile();

    service = module.get<AnalysisService>(AnalysisService);
    mockLlmService.generateText.mockClear();
    mockHurtformService.findLast_K.mockClear();
    mockMentalformService.findLast_K.mockClear();
  });

  describe('analyzeUserHealth', () => {
    it('should return default message if no data exists', async () => {
      mockHurtformService.findLast_K.mockResolvedValue([]);
      mockMentalformService.findLast_K.mockResolvedValue([]);

      const result = await service.analyzeUserHealth(1);

      expect(result.data_analyzed).toEqual({ physical: 0, mental: 0 });
      expect(result.message).toBe('沒有足夠的資料進行分析');
      expect(result.llm_response).toBe(
        '目前沒有任何身體或心理紀錄可供分析，請鼓勵使用者多加紀錄。',
      );
      expect(mockLlmService.generateText).not.toHaveBeenCalled();
    });

    it('should call LLM if physical data exists', async () => {
      mockHurtformService.findLast_K.mockResolvedValue([
        {
          id: 1,
          user_id: 1,
          fill_time: new Date(),
          title: 'Headache',
          pain_level: 5,
          description: 'Pain',
        },
      ]);
      mockMentalformService.findLast_K.mockResolvedValue([]);
      mockLlmService.generateText.mockResolvedValue('LLM Analysis');

      const result = await service.analyzeUserHealth(1);

      expect(result.data_analyzed.physical).toBe(1);
      expect(result.llm_response).toBe('LLM Analysis');
      expect(mockLlmService.generateText).toHaveBeenCalled();
    });

    it('should call LLM if mental data exists', async () => {
      mockHurtformService.findLast_K.mockResolvedValue([]);
      mockMentalformService.findLast_K.mockResolvedValue([
        {
          id: 1,
          user_id: 1,
          filled_time: new Date(),
          problem: [1, 2, 3],
        },
      ]);
      mockLlmService.generateText.mockResolvedValue('LLM Analysis');

      const result = await service.analyzeUserHealth(1);

      expect(result.data_analyzed.mental).toBe(1);
      expect(result.llm_response).toBe('LLM Analysis');
      expect(mockLlmService.generateText).toHaveBeenCalled();
    });
  });

  describe('clean()', () => {
    it('should return the body as is (validation only)', () => {
      // Since cleaning happens in Controller via Pipe, Service just receives data.
      // We verify that service accepts the data.
      const input: any = {
        name: 'Jason Bourne',
        email: 'jason@cia.gov',
        age: 32,
        tags: ['spy', 'action'],
      };

      const result = service.clean(input);

      expect(result.cleaned).toEqual(input);
      expect(result.is_valid).toBe(true);
    });

    it('should identify invalid data', () => {
      // Testing validateCleaned logic
      const input: any = { name: '', email: '', age: null };
      const result = service.clean(input);

      expect(result.is_valid).toBe(false);
      expect(result.message).toBe('Data validation failed.');
    });
  });
});
