import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Patient } from '../../database/entities/patient.entity';
import { Pagination } from '../../shared/decorator/pagination.decorator';
import { PaginationParam } from '../../shared/interface';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { PatientService } from './patient.service';

@Controller('patients')
@ApiTags('patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PatientControlelr {
  constructor(private patientService: PatientService) {}

  @Get()
  async getPatients(@Pagination() pagination: PaginationParam) {
    return await this.patientService.getPatients(pagination);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: Number })
  async getPatientById(@Param('id', ParseIntPipe) id: number) {
    return await this.patientService.getPatientById(id);
  }

  @Post()
  async createPatient(@Body() patient: Patient) {
    return await this.patientService.createPatient(patient);
  }

  @ApiParam({ name: 'id', type: Number })
  @Patch(':id')
  async updatePatient(
    @Body() patient: Patient,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.patientService.updatePatient(id, patient);
  }

  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  async deletePatient(@Param('id', ParseIntPipe) id: number) {
    return await this.patientService.deletePatient(id);
  }
}
