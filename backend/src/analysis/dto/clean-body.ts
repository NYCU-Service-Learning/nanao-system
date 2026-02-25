// src/analysis/dto/clean-body.dto.ts
import { IsString, IsOptional, IsArray, IsNumber, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer'; // 👈 導入 Transform

export class CleanBodyDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ? value.trim().replace(/\s+/g, '') : value) // 👈 1. 移除所有空格 (中文姓名習慣)
  name?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value ? value.trim().toLowerCase() : value) // 👈 2. 移除空格並轉小寫 (Email/Tag 習慣)
  email?: string;

  @IsOptional()
  @Type(() => Number) 
  @IsNumber()
  @Min(0)
  age?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
      // 3. 確保陣列內元素被清洗並去重
      if (!Array.isArray(value)) return [];
      return [...new Set(value.filter((t) => t).map((t: string) => t.trim().toLowerCase()))];
  })
  tags?: string[];
}