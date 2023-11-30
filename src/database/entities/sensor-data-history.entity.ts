import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Base } from './base.entity';
import { Patient } from './patient.entity';

@Entity()
export class SensorDataHistory extends Base {
  @Column()
  @ApiProperty()
  @IsString()
  equipmentId?: string;

  @Column()
  @ApiProperty()
  heartbeat?: number;

  @Column()
  @ApiProperty()
  spo2?: number;

  @Column({ type: 'timestamp' })
  @ApiProperty()
  timestamp?: Date;
}
