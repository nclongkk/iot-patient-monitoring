import { Equipment } from '../../../database/entities/equipment.entity';

export class CacheDataDto {
  equipment: Equipment;
  sessionStartAt: number;
  lastReceiveAt: number;
}
