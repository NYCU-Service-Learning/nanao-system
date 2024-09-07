import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException,HttpStatus, UseGuards } from '@nestjs/common';
import { UserDetailService } from './user-detail.service';
import { Prisma } from '@prisma/client';
import { AdminOrSameUserIdGuard, UserDetailCreateGuard } from 'src/auth/utils/guards/LocalGuard';
import { UserIdName } from 'src/auth/utils/metadata/GuardMetadata';

@Controller('user-detail')
export class UserDetailController {
  constructor(private readonly userDetailService: UserDetailService) {}

  @UseGuards(UserDetailCreateGuard)
  @Post()
  create(@Body() createUserDetailDto: Prisma.UserDetailCreateInput) {
    return this.userDetailService.create(createUserDetailDto);
  }

  @UseGuards(AdminOrSameUserIdGuard)
  @Get()
  findAll() {
    return this.userDetailService.findAll();
  }


  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userDetailService.findOne(+id);
  }


  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('id')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDetailDto: Prisma.UserDetailUpdateInput) {
    return this.userDetailService.update(+id, updateUserDetailDto);
  }

  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('id')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userDetailService.remove(+id);
  }
}
