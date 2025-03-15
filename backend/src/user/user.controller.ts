import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { AdminOrSameUserIdGuard } from 'src/auth/utils/guards/LocalGuard';
import { UserIdName } from 'src/auth/utils/metadata/GuardMetadata';
import { ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminOrSameUserIdGuard)
  @Post()
  @ApiOperation({ summary: '創建用戶', description: '' })
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
    return this.userService.findOne(Number(id));
  }

  @Get('/find/:username')
  findId(@Param('username') username: string) {
    return this.userService.findId(username);
  }

  @Get('/find/email/:email')
  findIdByEmail(@Param('email') email: string) {
    return this.userService.findIdByEmail(email);
  }

  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('id')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.userService.update(Number(id), updateUserDto);
  }

  @UseGuards(AdminOrSameUserIdGuard)
  @UserIdName('id')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(Number(id));
  }
}
