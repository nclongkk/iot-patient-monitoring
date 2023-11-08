import { Injectable } from '@nestjs/common';
import { AppRepository } from '../../database/database.repository';
import { Patient } from '../../database/entities/patient.entity';
import { PaginationParam, PaginationResult } from '../../shared/interface';
import { UpdatePatientDto } from './dtos/patient.dto';

@Injectable()
export class PatientService {
  constructor(private readonly appRepository: AppRepository) {}

  async createPatient(patient: Patient) {
    return this.appRepository.use(Patient).save(patient);
  }

  async getPatientById(id: number) {
    return this.appRepository.use(Patient).findOne({ where: { id } });
  }

  async getPatients({
    page,
    limit,
  }: PaginationParam): Promise<PaginationResult<Patient>> {
    const [patients, total] = await this.appRepository
      .use(Patient)
      .findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });
    return {
      data: patients,
      paging: {
        total,
        page,
        limit,
      },
    };
  }

  async updatePatient(id: number, patient: UpdatePatientDto) {
    return this.appRepository.use(Patient).update({ id }, patient);
  }
}
