import { TimestampParam } from './../../shared/interface/index';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Timestamp } from '../../shared/decorator/pagination.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { ReceiveSensorDataDto } from './dtos/receive-sensor-data.dto';
import { EquipmentService } from './equipment.service';

@ApiTags('Equipments')
@Controller('equipments')
export class EquipmentController {
  constructor(private equipmentService: EquipmentService) {}

  @Post('listen-sensor-data')
  async listenEquipment(@Body() data: ReceiveSensorDataDto) {
    console.log(data);
    return this.equipmentService.handleReceiveSensorData(data);
  }

  @Get('mock-sensor-event')
  async testSocketEvent() {
    return this.equipmentService.testSocketEvent();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getEquipments() {
    return this.equipmentService.getEquipments();
  }

  @Get('sensor-data-history')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getSensorDataHistory(@Timestamp() timestamp: TimestampParam) {
    return this.equipmentService.getSensorDataHistory(timestamp);
  }

  @Delete('sensor-data-history')
  async deleteSensorDataHistory() {
    return this.equipmentService.deleteSensorDataHistory();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getEquipmentById(id: string) {
    return this.equipmentService.getEquipmentById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/patient/:patientId')
  async updatePatientForEquipment(
    @Param('id') id: string,
    @Param('patientId', ParseIntPipe) patientId: number,
  ) {
    return this.equipmentService.updatePatientForEquipment(id, patientId);
  }
}
