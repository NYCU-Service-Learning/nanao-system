import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { YearformService } from './yearform.service';
import { Prisma } from '@prisma/client';
import { AdminOrSameUserIdGuard, FormDeleteGuard } from 'src/auth/utils/guards/LocalGuard';
import { SetFormMetaData, UserIdName } from 'src/auth/utils/metadata/GuardMetadata';

@Controller('yearform')
export class YearformController {
  constructor(private readonly yearformService: YearformService) {}

  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('userId')
  @Post(':userId')
  create(@Param('userId', ParseIntPipe) userId: number, @Body() createYearformDto: Prisma.YearFormCreateInput) {
    return this.yearformService.create(userId, createYearformDto);
  }  
  
  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('userId')
  @Get(':userId')
  findUserForm(@Param('userId', ParseIntPipe) userId: number, @Query('start') startTime?: string, @Query('end') endTime?: string) {
    return this.yearformService.findMany(userId, startTime, endTime);
  }

  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('userId')
  @Get(':userId/:num')
  findLast_K(@Param('userId', ParseIntPipe) userId: number, @Param('num', ParseIntPipe) k: number){
    return this.yearformService.findLast_K(userId, k);
  }
  
  @UseGuards(FormDeleteGuard)
  @SetFormMetaData('hurtForm', 'id')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.yearformService.remove(id);
  }
}
