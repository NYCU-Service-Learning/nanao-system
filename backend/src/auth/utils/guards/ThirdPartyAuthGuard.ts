import { Injectable, CanActivate, BadRequestException } from '@nestjs/common';
import { getAuthConfig } from '../AuthConfig';

@Injectable()
export class GoogleAuthEnabledGuard implements CanActivate {
  canActivate(): boolean {
    const config = getAuthConfig();
    if (!config.google.enabled) {
      throw new BadRequestException('Google authentication is not configured');
    }
    return true;
  }
}

@Injectable()
export class LineLoginAuthEnabledGuard implements CanActivate {
  canActivate(): boolean {
    const config = getAuthConfig();
    if (!config.line.login.enabled) {
      throw new BadRequestException(
        'Line login authentication is not configured',
      );
    }
    return true;
  }
}

@Injectable()
export class LineLinkAuthEnabledGuard implements CanActivate {
  canActivate(): boolean {
    const config = getAuthConfig();
    if (!config.line.link.enabled) {
      throw new BadRequestException(
        'Line link authentication is not configured',
      );
    }
    return true;
  }
}
