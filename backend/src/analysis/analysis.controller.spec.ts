import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { GeminiService } from '../aiassistant/Aiassistant.service';
import { HurtformService } from '../hurtform/hurtform.service';
import { MentalformService } from '../mentalform/mentalform.service';
import { ValidationPipe } from '@nestjs/common';

// Mocks
const mockLlmService = {
  generateText: jest.fn().mockResolvedValue('Mocked AI Response'),
};

const mockHurtformService = {
  findLast_K: jest.fn().mockResolvedValue([]),
};

const mockMentalformService = {
  findLast_K: jest.fn().mockResolvedValue([]),
};

// We can mock AnalysisService directly if we want to test Controller only,
// OR we can use real AnalysisService with mocked dependencies to test integration of Controller+Service.
// Let's use real AnalysisService with mocked dependencies to match previous intent.

describe('AnalysisController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AnalysisController],
      providers: [
        AnalysisService,
        { provide: GeminiService, useValue: mockLlmService },
        { provide: HurtformService, useValue: mockHurtformService },
        { provide: MentalformService, useValue: mockMentalformService },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();
  });

  it('/analysis/clean (POST) should return cleaned data', () => {
    return request(app.getHttpServer())
      .post('/analysis/clean')
      .send({ name: '  bob  ' })
      .expect(201)
      .expect((res) => {
        expect(res.body.cleaned.name).toBe('bob');
      });
  });

  it('/analysis/health/:userId (GET) should analyze health', () => {
    return request(app.getHttpServer())
      .get('/analysis/health/1')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('沒有足夠的資料進行分析');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
