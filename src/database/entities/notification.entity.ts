import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { NOTIFICATION_TYPE } from '../../constants/local.constant';
import { Base } from './base.entity';
import { Equipment } from './equipment.entity';

@Entity()
@Index('idx_createdAt', ['createdAt'])
export class Notification extends Base {
  @Column()
  type: NOTIFICATION_TYPE;

  @ManyToOne(() => Equipment)
  equipment?: Equipment;

  @Column()
  message?: string;

  @Column()
  payload?: string;
}
