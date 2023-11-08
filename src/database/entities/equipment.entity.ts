import { Column, ManyToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Patient } from './patient.entity';

export class Equipment {
  @PrimaryColumn()
  id?: string;

  @Column()
  name?: string;

  @OneToOne(() => Patient)
  patient: Patient;
}
