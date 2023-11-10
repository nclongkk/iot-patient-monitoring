import { Module } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipmet.controller';

@Module({
  controllers: [EquipmentController],
  providers: [EquipmentService],
})
export class EquipmentModule {}
