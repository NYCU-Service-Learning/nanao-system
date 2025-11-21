import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AnalysisModule } from './analysis.module';
import { GeminiService } from '../aiassistant/Aiassistant.service';

describe('AnalysisController (E2E)', () => {
  let app: INestApplication;
  
  // 再次 Mock LlmService，這次是在模組層級替換
  const mockLlmService = {
    generateText: jest.fn().mockResolvedValue('Mocked AI Response'),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AnalysisModule],
    })
    .overrideProvider(GeminiService) // 強制替換掉原本的 Service
    .useValue(mockLlmService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/analysis (POST) should return cleaned data', () => {
    return request(app.getHttpServer())
      .post('/analysis')
      .send({ name: '  bob  ' })
      .expect(201)
      .expect((res) => {
        expect(res.body.cleaned.name).toBe('Bob');
      });
  });

  it('/analysis/llm (POST) should return cleaned data AND llm response', () => {
    return request(app.getHttpServer())
      .post('/analysis/llm')
      .send({ name: '  bob  ' })
      .expect(201)
      .expect((res) => {
        expect(res.body.cleaned.name).toBe('Bob');
        expect(res.body.llm).toBe('Mocked AI Response'); // 驗證這是不是 Mock 的值
      });
  });

  afterAll(async () => {
    await app.close();
  });
});