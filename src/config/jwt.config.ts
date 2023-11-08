import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

export const TOKEN_EXPIRE = '86400s'; // 24h

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private configService: ConfigService) {}
  createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    return {
      secret: this.configService.get('APP_SECRET'),
      signOptions: { expiresIn: TOKEN_EXPIRE },
      global: true,
    };
  }
}
