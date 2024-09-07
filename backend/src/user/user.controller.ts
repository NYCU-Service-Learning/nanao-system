import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { AdminOrSameUserIdGuard } from 'src/auth/utils/guards/LocalGuard';
import { UserIdName } from 'src/auth/utils/metadata/GuardMetadata';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminOrSameUserIdGuard)
  @Post()
  create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AdminOrSameUserIdGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
  
  @Get('/find/:username')
  findId(@Param('username') username: string){
    return this.userService.findId(username);
  }

  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('id')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput) {
    return this.userService.update(+id, updateUserDto);
  }

  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('id')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
