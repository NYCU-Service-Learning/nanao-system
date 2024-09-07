import { ConsoleLogger, HttpException, HttpStatus, Injectable, flatten } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
/*
TODO
  findMany : Date validation
*/

@Injectable()
export class HurtformService {
  constructor(private readonly databaseService: DatabaseService){}

  async create(userId: number, createHurtformDto: Prisma.HurtFormCreateInput) {

    // Check if user exists
    const user = await this.databaseService.user.findUnique({
      where:{
        id: userId
      }
    })
    if (!user){
      throw new HttpException(`User ${userId} not found.`, HttpStatus.BAD_REQUEST);
    }
    
    return {
      data: await this.databaseService.hurtForm.create({
          data: {...createHurtformDto, user: {connect: {id: userId}}}
        }),
    };
  }

  async findMany(userId: number, startTimeString?: string, endTimeString?: string){

    // Check if user exists
    const user = await this.databaseService.user.findUnique({
      where:{
        id: userId
      }
    })
    if (!user){
      throw new HttpException(`User ${userId} not found.`, HttpStatus.BAD_REQUEST);
    }

    // Check if startTime is later than endTime
    if (startTimeString && endTimeString && new Date(startTimeString) > new Date(endTimeString)) {
      throw new HttpException(`Start time ${startTimeString} is later than end time ${endTimeString}.`, HttpStatus.BAD_REQUEST);
    }

    try {
      return {
        data: await this.databaseService.hurtForm.findMany({
          where: {
            user_id: userId,
            fill_time:{
              gte: startTimeString,
              lte: endTimeString
            }
          },
          orderBy: {
            'id': 'desc'
          }
        })
      }
    }
    catch (e: unknown) {
      if (e instanceof Prisma.PrismaClientValidationError) {
        // Check if the error is due to invalid date
        throw new HttpException("'start' or 'end' is not a valid date.", HttpStatus.BAD_REQUEST);
      }
      throw e;
    }
  }

  async findLast_K(userId: number, k: number){
    // Check if user exists
    const user = await this.databaseService.user.findUnique({
      where:{
        id: userId
      }
    })
    if (!user){
      throw new HttpException(`User ${userId} not found.`, HttpStatus.BAD_REQUEST);
    }

    let formList = await this.databaseService.hurtForm.findMany({
      where:{
        user_id:userId
      },
      orderBy: {
        id: 'desc'
      }
    })
    return formList.slice(0, k < formList.length ? k : formList.length);
  }

  async remove(id: number) {
    // Check if hurtForm exists
    const hurtForm = await this.databaseService.hurtForm.findUnique({
      where:{
        id: id
      }
    })
    if(!hurtForm){
       throw new HttpException(`hurtForm ${id} not found.`, HttpStatus.NOT_FOUND);
    }

    return await this.databaseService.hurtForm.delete({
      where:{
        id: id
      }
    })
  }
}
