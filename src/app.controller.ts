import { BadRequestException, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    throw new BadRequestException('Bad requessssst');
    return this.appService.getHello();
  }
}
