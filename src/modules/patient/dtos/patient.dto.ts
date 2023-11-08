import { PartialType } from '@nestjs/swagger';
import { Patient } from '../../../database/entities/patient.entity';

export class UpdatePatientDto extends PartialType(Patient) {}
