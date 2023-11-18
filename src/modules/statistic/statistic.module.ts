import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';

@Module({
  controllers: [StatisticController],
})
export class StatisticModule {}
