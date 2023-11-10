import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { ReceiveSensorDataDto } from './dtos/receive-sensor-data.dto';
import { EquipmentService } from './equipment.service';

@ApiTags('Equipments')
@Controller('equipments')
export class EquipmentController {
  constructor(private equipmentService: EquipmentService) {}

  @Post('listen-sensor-data')
  async listenEquipment(@Body() data: ReceiveSensorDataDto) {
    return this.equipmentService.handleReceiveSensorData(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getEquipments() {
    return this.equipmentService.getEquipments();
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