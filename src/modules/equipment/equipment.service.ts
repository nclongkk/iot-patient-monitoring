import { Injectable } from '@nestjs/common';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import {
  EQUIPMENT_STATUS,
  EVENT_TYPE,
  NOTIFICATION_TYPE,
} from '../../constants/local.constant';
import { AppRepository } from '../../database/database.repository';
import { Equipment } from '../../database/entities/equipment.entity';
import { Patient } from '../../database/entities/patient.entity';
import { SensorDataHistory } from '../../database/entities/sensor-data-history.entity';
import { Notification } from '../../database/entities/notification.entity';
import { TimestampParam } from '../../shared/interface';
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

    this.appRepository.use(SensorDataHistory).save({
      equipmentId: id,
      heartbeat,
      spo2,
      timestamp: new Date(sessionStartAt + timestamp),
    });
    this.checkSpo2AndSendNotification(id, spo2, data);

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

  private async checkSpo2AndSendNotification(
    equipmentId,
    spo2,
    data: ReceiveSensorDataDto,
  ) {
    const threshold = 95;

    const warningSessionKey = `equipment:${equipmentId}:warning-session`;
    const warningSession = await this.redisHelper.getKey(warningSessionKey);
    if (spo2 < threshold) {
      if (!warningSession) {
        const warningSession = {
          isWarning: false,
          lastReceiveSpo2: spo2,
          countSpo2LessThanThreshold: 1,
          countSpo2GreaterThanThreshold: 0,
        };
        await this.redisHelper.setKey(warningSessionKey, warningSession);
        return;
      }
      warningSession.countSpo2LessThanThreshold++;
      await this.redisHelper.setKey(warningSessionKey, warningSession);

      if (
        warningSession.isWarning ||
        warningSession.countSpo2LessThanThreshold < 5
      ) {
        return;
      }

      //Warning
      this.warningSpo2(data);
      warningSession.isWarning = true;
      await this.redisHelper.setKey(warningSessionKey, warningSession);
    } else {
      if (!warningSession) {
        //Patient is healthy, no need to check
        return;
      }

      warningSession.lastReceiveSpo2 = spo2;
      await this.redisHelper.setKey(warningSessionKey, warningSession);

      if (warningSession.lastReceiveSpo2 > threshold) {
        warningSession.countSpo2GreaterThanThreshold++;
        await this.redisHelper.setKey(warningSessionKey, warningSession);
        if (warningSession.countSpo2GreaterThanThreshold > 5) {
          //Patient is healthy again, no need to check
          await this.redisHelper.deleteKey(warningSessionKey);
          return;
        }
      } else {
        warningSession.countSpo2GreaterThanThreshold = 1;
      }
    }
  }

  private async warningSpo2(data: ReceiveSensorDataDto) {
    try {
      const { id } = data;
      const equipment = await this.appRepository.use(Equipment).findOne({
        where: { id },
        relations: ['patient'],
      });
      const message = `Bệnh nhân ${equipment.patient.name} có chỉ số SpO2 thấp hơn 95%`;
      console.log(message);
      this.socketGateway.server.emit(EVENT_TYPE.NOTIFICATION, {
        equipmentId: id,
        message,
      });
      this.appRepository.use(Notification).save({
        equipment,
        message,
        type: NOTIFICATION_TYPE.SPO2_WARNING,
        payload: JSON.stringify(data),
      });
    } catch (error) {
      error;
    }
  }

  async testSocketEvent() {
    let count = 0;
    const startAt = Date.now();
    const interval = setInterval(() => {
      count++;
      //if count from 20 to 40 or 40 to 60, spo2 will be 90, else spo2 will be 100
      let spo2 = 100;
      if ((count > 20 && count <= 40) || (count > 60 && count <= 80)) {
        spo2 = 90;
      }
      this.handleReceiveSensorData({
        id: 'equipment-001',
        heartbeat: Math.floor(Math.random() * 100),
        spo2,
        timestamp: Date.now() - startAt,
      });
      if (count === 100) {
        clearInterval(interval);
      }
    }, 500);
  }

  async getSensorDataHistory({ start, end }: TimestampParam) {
    const where = {};
    if (start && end) {
      where['timestamp'] = Between(new Date(start), new Date(end));
    } else if (start) {
      where['timestamp'] = MoreThanOrEqual(new Date(start));
    } else if (end) {
      where['timestamp'] = LessThanOrEqual(new Date(end));
    }
    return this.appRepository.use(SensorDataHistory).find({ where });
  }

  async deleteSensorDataHistory() {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return this.appRepository.use(SensorDataHistory).delete({
      timestamp: LessThanOrEqual(threeDaysAgo),
    });
  }
}
