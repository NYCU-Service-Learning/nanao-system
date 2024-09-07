import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { WeekformService } from './weekform.service';
import { Prisma } from '@prisma/client';
import { AdminOrSameUserIdGuard, FormDeleteGuard } from 'src/auth/utils/guards/LocalGuard';
import { SetFormMetaData, UserIdName } from 'src/auth/utils/metadata/GuardMetadata';
@Controller('weekform')
export class WeekformController {
  constructor(private readonly weekformService: WeekformService) {}

  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('userId')
  @Post(':userId')
  create(@Param('userId', ParseIntPipe) userId: number, @Body() createWeekformDto: Prisma.WeekFormCreateInput) {
    return this.weekformService.create(userId, createWeekformDto);
  }

  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('userId')
  @Get(':userId')
  findUserForm(@Param('userId', ParseIntPipe) userId: number, @Query('start') startTime?: string, @Query('end') endTime?: string) {
    return this.weekformService.findMany(userId, startTime, endTime);
  }

  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('userId')
  @Get(':userId/:num')
  findLast_K(@Param('userId', ParseIntPipe) userId: number, @Param('num', ParseIntPipe) k: number){
    return this.weekformService.findLast_K(userId, k);
  }

  @UseGuards(FormDeleteGuard)
  @SetFormMetaData('weekForm', 'id')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.weekformService.remove(id);
  }
}
