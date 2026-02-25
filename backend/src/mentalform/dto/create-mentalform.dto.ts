import { ArrayMaxSize, ArrayMinSize, IsArray, IsNumber } from 'class-validator';

export class CreateMentalformDto {
  @ArrayMaxSize(6)
  @ArrayMinSize(6)
  @IsNumber({}, { each: true })
  @IsArray()
  public readonly problem: number[];
}
