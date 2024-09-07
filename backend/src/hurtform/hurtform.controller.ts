import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { HurtformService } from './hurtform.service';
import { Prisma } from '@prisma/client';
import { AdminOrSameUserIdGuard, FormDeleteGuard } from 'src/auth/utils/guards/LocalGuard';
import { SetFormMetaData, UserIdName } from 'src/auth/utils/metadata/GuardMetadata';

@Controller('hurtform')
export class HurtformController {
  constructor(private readonly hurtformService: HurtformService) {}

  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('userId')
  @Post(':userId')
  create(@Param('userId', ParseIntPipe) userId: number, @Body() createHurtformDto: Prisma.HurtFormCreateInput) {
    return this.hurtformService.create(userId, createHurtformDto);
  }

  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('userId')
  @Get(':userId')
  findUserForm(@Param('userId', ParseIntPipe) userId: number, @Query('start') startTime?: string, @Query('end') endTime?: string) {
    return this.hurtformService.findMany(userId, startTime, endTime);
  }

  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('userId')
  @Get(':userId/:num')
  findLast_K(@Param('userId', ParseIntPipe) userId: number, @Param('num', ParseIntPipe) k: number){
    return this.hurtformService.findLast_K(userId, k);
  }


  @UseGuards(FormDeleteGuard)
  @SetFormMetaData('hurtForm', 'id')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hurtformService.remove(id);
  }
}
