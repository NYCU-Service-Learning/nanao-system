import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google-login') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // 檢查是否是回調路由且有 error 參數
    if (request.url.includes('/google/login/callback') && request.query.error) {
      return true; // 允許請求繼續，讓控制器處理錯誤
    }

    try {
      const result = (await super.canActivate(context)) as boolean;
      
      // 只在認證成功時執行登入
      if (result) {
        await super.logIn(request);
      }
      
      return result;
    } catch (error) {
      // 如果是用戶取消登入，不拋出錯誤
      if (request.query.error === 'access_denied') {
        return true;
      }
      throw error;
    }
  }
}