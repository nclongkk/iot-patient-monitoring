import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { EQUIPMENT_STATUS } from '../../constants/local.constant';
import { Patient } from './patient.entity';

@Entity()
export class Equipment {
  @PrimaryColumn()
  id?: string;

  @Column()
  status?: EQUIPMENT_STATUS;

  @OneToOne(() => Patient)
  @JoinColumn()
  patient?: Patient;
}
