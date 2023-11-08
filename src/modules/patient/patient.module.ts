import { Module } from '@nestjs/common';
import { PatientControlelr } from './patient.controller';
import { PatientService } from './patient.service';

@Module({
  controllers: [PatientControlelr],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
