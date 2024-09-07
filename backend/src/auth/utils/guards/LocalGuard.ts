import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local'){
    async canActivate(context: ExecutionContext){
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return result;
    }
}

// this guard can check whether the user is an ADMIN
/*
To use this guard:
    if you only want to check ADMIN:
        add the following decorator infront of the route you want to protect in controller
        @UseGuard(AdminOrSameUserIdGuard)
    
    if you want to check ADMIN or check whether the user is same with the route params userId:
        add the following decorator infront of the route you want to protect in controller
        
        @UseGuard(AdminOrSameUserIdGuard)
        @UserIdParamsName({your parameter name of user id})

        for example, if your route is like @Get(/:id)
        the id parameter is the user id
        then you should add @UserIdParamsName('id') in front of the route

    *** important ***
    this guard will only check the userId in the route parameters
*/
@Injectable()
export class AdminOrSameUserIdGuard implements CanActivate{
    constructor(private readonly reflector: Reflector,){}
    async canActivate(context: ExecutionContext){
        const req = context.switchToHttp().getRequest<Request>();
        if(!req.isAuthenticated())
            throw new HttpException("please login first", HttpStatus.UNAUTHORIZED);

        if(req.user['role'] == 'ADMIN')
            return true;
        
        const userId_params_name = this.reflector.get<string>('userId', context.getHandler());

        if(req.user['id'] == req.params[userId_params_name]){
            return true;
        }
        return false;
    }
}


@Injectable()
export class UserDetailCreateGuard implements CanActivate{
    constructor(private readonly reflector: Reflector,){}
    async canActivate(context: ExecutionContext){
        const req = context.switchToHttp().getRequest<Request>();
        if(!req.isAuthenticated())
            throw new HttpException("please login first", HttpStatus.UNAUTHORIZED);

        if(req.user['role'] == 'ADMIN')
            return true;
        if(req.user['id'] == req.body['user']['connect']['id']){
            return true;
        }
        return false;
    }
}

@Injectable()
export class FormDeleteGuard implements CanActivate{
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly reflector: Reflector,
    ){}

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();
        if(!req.isAuthenticated())
            throw new HttpException("please login first", HttpStatus.UNAUTHORIZED);

        if(req.user['role'] == 'ADMIN')
            return true;

        const formType = this.reflector.get<string>('formType', context.getHandler())
        const formIdName = this.reflector.get<string>('formIdName', context.getHandler())
        const formId = parseInt(req.params[formIdName])

        if(isNaN(formId)){
            throw new HttpException('form_id parameter has invalid format', HttpStatus.BAD_REQUEST);
        }


        const form = await this.databaseService[formType].findUnique({
            where:{
                id: formId
            }
        })

        if(!form){
            throw new HttpException('form not found', HttpStatus.NOT_FOUND)
        }
        if(form.user_id == req.user['id'])
            return true;
        return false;
    }
}