import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EQUIPMENT_STATUS } from '../../constants/local.constant';
import { AppRepository } from '../../database/database.repository';
import { Equipment } from '../../database/entities/equipment.entity';
import { Patient } from '../../database/entities/patient.entity';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';

@Controller('statistics')
@ApiTags('statistics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StatisticController {
  constructor(private appRepository: AppRepository) {}

  @Get()
  async getStatistics() {
    const totalPatients = await this.appRepository.use(Patient).count();
    const totalEquipments = await this.appRepository.use(Equipment).count();
    const totalActiveEquipments = await this.appRepository
      .use(Equipment)
      .count({ where: { status: EQUIPMENT_STATUS.ACTIVE } });

    return {
      totalPatients,
      totalEquipments,
      totalActiveEquipments,
    };
  }
}
