import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GeminiService } from './Aiassistant.service';

// Mock GoogleGenerativeAI class
const mockGenerateContent = jest.fn();
const mockGetGenerativeModel = jest.fn().mockReturnValue({
  generateContent: mockGenerateContent,
});

jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: mockGetGenerativeModel,
      };
    }),
  };
});

describe('GeminiService', () => {
  let service: GeminiService;
  // let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeminiService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('fake-api-key'),
          },
        },
      ],
    }).compile();

    service = module.get<GeminiService>(GeminiService);
    // configService = module.get<ConfigService>(ConfigService);

    mockGenerateContent.mockClear();
    mockGetGenerativeModel.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateText', () => {
    it('should generate text successfully', async () => {
      const mockResponse = {
        response: Promise.resolve({
          text: () => 'Generated Response',
        }),
      };
      mockGenerateContent.mockResolvedValue(mockResponse);

      const result = await service.generateText(
        'System Prompt',
        'User Content',
      );

      expect(result).toBe('Generated Response');
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.stringContaining('System Prompt'),
      );
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.stringContaining('User Content'),
      );
    });

    it('should handle errors gracefully', async () => {
      mockGenerateContent.mockRejectedValue(new Error('API Error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const result = await service.generateText(
        'System Prompt',
        'User Content',
      );

      expect(result).toBe('AI 目前忙碌中，無法提供建議。');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
