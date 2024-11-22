import { Injectable } from '@nestjs/common';
import { SpeechClient, protos } from '@google-cloud/speech';
import * as fs from 'fs';
import { extractKeywords } from './keyword-utils'; // Import extractKeywords

@Injectable()
export class SttChineseService {
  private client: SpeechClient;

  constructor() {
    this.client = new SpeechClient(); // Initialize Google Cloud Speech client
  }

  async transcribeAndExtract(filePath: string): Promise<{ transcription: string; keywords: string }> {
    // Read the MP3 file into a Base64-encoded string
    const audioBytes = fs.readFileSync(filePath).toString('base64');

    // Configure the request for MP3 input
    const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
      audio: { content: audioBytes },
      config: {
        encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.MP3, // Use the enum
        sampleRateHertz: 16000, // Adjust this if your MP3 sample rate is different
        languageCode: 'zh-CN', // Set to Chinese
      },
    };

    try {
      // Perform transcription
      const result = await this.client.recognize(request); // Get the result tuple
      const response = result[0]; // Access the first element

      const transcription = response.results
        ?.map((result) => result.alternatives[0].transcript)
        .join(' ') || 'No transcription available';

      // Extract keywords as space-separated string
      const keywords = extractKeywords(transcription);

      return { transcription, keywords };
    } catch (error) {
      console.error('Error during transcription or keyword extraction:', error);
      throw new Error('Transcription or keyword extraction failed');
    }
  }
}
