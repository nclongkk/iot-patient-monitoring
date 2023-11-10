import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { SocketGateway } from './shared/socket/socket.gateway';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private socketGateway: SocketGateway,
  ) {}

  @Get()
  async getHello() {
    // this.socketGateway.server.emit('events', 'asdfasfdsafd');
    return this.appService.getHello();
  }

  @Post()
  async receiveMsg(@Body() data, @Query() query) {
    console.log(data);
  }
}
