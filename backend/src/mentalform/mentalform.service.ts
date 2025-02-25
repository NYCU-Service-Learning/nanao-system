import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateMentalformDto } from './dto/create-mentalform.dto';

@Injectable()
export class MentalformService {
  constructor(private readonly databaseService: DatabaseService){}
  
  // directly transform 
  mentalformListTrans(mentalformList){
    let newMentalformList = []
    for(let i = 0; i < mentalformList.length; i++){
      let tmpMentalform = {
        id: mentalformList[i]["id"],
        user_id: mentalformList[i]["user_id"],
        filled_time: mentalformList[i]["fill_time"],
        problem: []
      }
      for (let j = 1; j <= 6; j++){
        tmpMentalform["problem"].push(mentalformList[i][`problem${j}`])
      }
      newMentalformList.push(tmpMentalform)
    }
    return newMentalformList
  }


  async create(userId: number, createMentalformDto: CreateMentalformDto) {
    // Check if user exists
    const user = await this.databaseService.user.findUnique({
      where:{
        id: userId
      }
    })
    if (!user){
      throw new HttpException(`User ${userId} not found.`, HttpStatus.BAD_REQUEST);
    }
    
    const databaseFormat: Prisma.MentalFormCreateInput = {
        "problem1": createMentalformDto['problem'][0],
        "problem2": createMentalformDto['problem'][1],
        "problem3": createMentalformDto['problem'][2],
        "problem4": createMentalformDto['problem'][3],
        "problem5": createMentalformDto['problem'][4],
        "problem6": createMentalformDto['problem'][5],
        user: {connect: {id: userId}}
    }
    return {
      data: await this.databaseService.mentalForm.create({
          data: databaseFormat
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
      let mentalFormList = await this.databaseService.mentalForm.findMany({
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
      mentalFormList = this.mentalformListTrans(mentalFormList);
      return mentalFormList
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

    let formList = await this.databaseService.mentalForm.findMany({
      where:{
        user_id:userId
      },
      orderBy: {
        id: 'desc'
      }
    })
    formList = formList.slice(0, k < formList.length ? k : formList.length);
    return this.mentalformListTrans(formList)
  }

  async remove(id: number) {
    // Check if mentalForm exists
    const mentalForm = await this.databaseService.mentalForm.findUnique({
      where:{
        id: id
      }
    })
    if(!mentalForm){
       throw new HttpException(`mentalForm ${id} not found.`, HttpStatus.NOT_FOUND);
    }

    return await this.databaseService.mentalForm.delete({
      where:{
        id: id
      }
    })
  }
}
