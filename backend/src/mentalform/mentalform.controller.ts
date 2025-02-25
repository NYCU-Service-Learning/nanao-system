import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MentalformService } from './mentalform.service';
import { AdminOrSameUserIdGuard, FormDeleteGuard } from 'src/auth/utils/guards/LocalGuard';
import { SetFormMetaData, UserIdName } from 'src/auth/utils/metadata/GuardMetadata';
import { Prisma } from '@prisma/client';
import { CreateMentalformDto } from './dto/create-mentalform.dto';

@Controller('mentalform')
export class MentalformController {
    constructor(private readonly mentalformService: MentalformService) {}

  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('userId')
  @Post(':userId')
  @UsePipes(ValidationPipe)
  create(@Param('userId', ParseIntPipe) userId: number, @Body() createMentalformDto: CreateMentalformDto) {
    return this.mentalformService.create(userId, createMentalformDto);
  }

  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('userId')
  @Get(':userId')
  findUserForm(@Param('userId', ParseIntPipe) userId: number, @Query('start') startTime?: string, @Query('end') endTime?: string) {
    return this.mentalformService.findMany(userId, startTime, endTime);
  }

  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('userId')
  @Get(':userId/:num')
  findLast_K(@Param('userId', ParseIntPipe) userId: number, @Param('num', ParseIntPipe) k: number){
    return this.mentalformService.findLast_K(userId, k);
  }


  @UseGuards(FormDeleteGuard)
  @SetFormMetaData('mentalForm', 'id')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mentalformService.remove(id);
  }
}
