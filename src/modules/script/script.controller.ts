import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { ScriptService } from './script.serviec';

@Controller('scripts')
@ApiTags('scripts')
export class ScriptController {
  constructor(private readonly scriptService: ScriptService) {}

  @Get('generate-user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async generateUser(@Req() req) {
    await this.scriptService.generateUser();
  }
}
