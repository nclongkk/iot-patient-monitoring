import { Injectable } from '@nestjs/common';
import { EQUIPMENT_STATUS, EVENT_TYPE } from '../../constants/local.constant';
import { AppRepository } from '../../database/database.repository';
import { Equipment } from '../../database/entities/equipment.entity';
import { Patient } from '../../database/entities/patient.entity';
import { RedisHelperService } from '../../shared/redis-helper/redis-helper.service';
import { SocketGateway } from '../../shared/socket/socket.gateway';
import { ReceiveSensorDataDto } from './dtos/receive-sensor-data.dto';
import { CacheDataDto } from './interfaces/cache-data.dto';

@Injectable()
export class EquipmentService {
  constructor(
    private appRepository: AppRepository,
    private redisHelper: RedisHelperService,
    private socketGateway: SocketGateway,
  ) {}

  async getEquipments() {
    return await this.appRepository
      .use(Equipment)
      .find({ relations: ['patient'] });
  }

  async getEquipmentById(id: string) {
    return await this.appRepository
      .use(Equipment)
      .findOne({ where: { id }, relations: ['patient'] });
  }

  async updatePatientForEquipment(id: string, patientId: number) {
    const equipment = await this.appRepository
      .use(Equipment)
      .findOne({ where: { id }, relations: ['patient'] });

    // To update the patient, you should create a new patient entity with the given patientId.
    const patient = new Patient();
    patient.id = patientId;
    equipment.patient = patient;

    return await this.appRepository.use(Equipment).save(equipment);
  }

  async handleReceiveSensorData(data: ReceiveSensorDataDto) {
    const { id, heartbeat, spo2, timestamp } = data;

    const { equipment, sessionStartAt, lastReceiveAt } =
      await this.getEquipmentData(id);
    this.socketGateway.server.emit(`sensor-data/${id}`, {
      id,
      heartbeat,
      spo2,
      timestamp: new Date(sessionStartAt + timestamp),
      equipment,
    });

    setTimeout(async () => {
      const { equipment, sessionStartAt, lastReceiveAt } =
        await this.redisHelper.getKey(this.getEquipmentKeyRedis(id));
      if (lastReceiveAt + 5000 > Date.now()) {
        return;
      }

      equipment.status = EQUIPMENT_STATUS.INACTIVE;
      await this.appRepository.use(Equipment).save(equipment);
      await this.redisHelper.deleteKey(this.getEquipmentKeyRedis(id));
      this.socketGateway.server.emit(EVENT_TYPE.EQUIPMENT_STATUS, {
        id,
        status: EQUIPMENT_STATUS.INACTIVE,
      });
    }, 5000);
  }

  private getEquipmentKeyRedis(id) {
    return `equipment:${id}`;
  }

  async getEquipmentData(id: string): Promise<CacheDataDto> {
    const key = this.getEquipmentKeyRedis(id);
    let data: CacheDataDto = await this.redisHelper.getKey(key);
    if (data) {
      data.lastReceiveAt = Date.now();
      await this.redisHelper.setKey(key, data);
      return data;
    }

    let equipment = await this.appRepository
      .use(Equipment)
      .findOne({ where: { id } });
    if (!equipment) {
      equipment = new Equipment();
      equipment.id = id;
      equipment.status = EQUIPMENT_STATUS.ACTIVE;
      equipment = await this.appRepository.use(Equipment).save(equipment);
    }
    if (equipment.status === EQUIPMENT_STATUS.INACTIVE) {
      equipment.status = EQUIPMENT_STATUS.ACTIVE;
      equipment = await this.appRepository.use(Equipment).save(equipment);
    }
    this.socketGateway.server.emit(EVENT_TYPE.EQUIPMENT_STATUS, {
      id,
      status: EQUIPMENT_STATUS.ACTIVE,
    });

    data = {
      equipment,
      sessionStartAt: Date.now(),
      lastReceiveAt: Date.now(),
    };
    await this.redisHelper.setKey(key, data);
    return data;
  }
}
