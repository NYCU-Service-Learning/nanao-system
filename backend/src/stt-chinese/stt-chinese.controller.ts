import { Controller, Get, Post, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SttChineseService } from './stt-chinese.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('stt-chinese')
export class SttChineseController {
  constructor(private readonly sttChineseService: SttChineseService) {}

  @Get()
  getHello(): string {
    return "stt-chinese is working";
  }


  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const tempFilePath = path.join(__dirname, `../../${file.originalname}`);

    // Save the uploaded MP3 file temporarily
    fs.writeFileSync(tempFilePath, file.buffer);

    try {
      const { transcription, keywords } = await this.sttChineseService.transcribeAndExtract(tempFilePath);
      return { message: 'Success', transcription, keywords };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      // Cleanup the temporary file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  }
}
