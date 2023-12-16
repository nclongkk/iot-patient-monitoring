import { Controller, Get, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AppRepository } from '../../database/database.repository';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Notification } from '../../database/entities/notification.entity';
import { FindManyOptions, LessThan, MoreThan } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Controller('notifications')
@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private appRepository: AppRepository) {}

  @Get()
  @ApiQuery({ name: 'lastId', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  async getNotifications(@Query() query: any) {
    const { lastId, limit = 5, toDate } = query;

    if (toDate) {
      console.log('toDate', toDate);
      return await this.appRepository.use(Notification).find({
        order: { id: 'DESC' },
        where: { createdAt: MoreThan(new Date(toDate)) },
      });
    }

    const queryObj: FindManyOptions<Notification> = {
      order: { id: 'DESC' },
      take: limit,
    };
    if (lastId) {
      queryObj['where'] = { id: LessThan(lastId) };
    }
    return await this.appRepository.use(Notification).find(queryObj);
  }

  @Patch('read')
  readNotification(@Req() req: any) {
    console.log('req.user', req.user);
    return this.appRepository
      .use(User)
      .update({ id: req.user.id }, { lastReadNotificationAt: new Date() });
  }
}
