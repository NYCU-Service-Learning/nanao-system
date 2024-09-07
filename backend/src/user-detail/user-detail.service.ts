import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserDetailService {
  constructor(private readonly databaseService: DatabaseService){}
  async create(createUserDetailDto: Prisma.UserDetailCreateInput) {
    try{
      return await this.databaseService.userDetail.create({
        data: createUserDetailDto,
      })
    } catch(error){
      if (error.message.includes('No \'User\' record')) {
        throw new NotFoundException('User with the given id does not exist');
      } else if((error.message.includes('Argument') && error.message.includes('is missing')) || (error.message.includes('Unknown argument'))){
        throw new BadRequestException('bad request, json format is incorrect')
      } else {
        throw error;
      }
    }
  }

  async findAll() {
    return await this.databaseService.userDetail.findMany();
  }

  async findOne(id: number) {
    const user_detail = await this.databaseService.userDetail.findUnique({
      where:{
        user_id: id,
      }
    });
    if (!user_detail){
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user_detail;
  }

  async update(id: number, updateUserDetailDto: Prisma.UserDetailUpdateInput) {
    try{
      const user_detail = await this.findOne(id)
      return await this.databaseService.userDetail.update({
        where:{
          user_id: id,
        },
        data: updateUserDetailDto,
      });
    } catch(error){
      if (error.message.includes('No \'User\' record')) {
        throw new NotFoundException('User with the given id does not exist');
      } else if(error.message.includes('Unknown argument')){
        throw new BadRequestException('bad request, unknown labels is included')
      } else {
        throw error;
      }
    }
  }

  async remove(id: number) {
    try{
      const user_detail = await this.findOne(id)
      return this.databaseService.userDetail.delete({
        where:{
          user_id: id,
        }
      });
    } catch(error){
      throw error;
    }
  }
}
