import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SwaggerConfig } from './config/swagger.config';
import { DatabaseModule } from './database/database.module';
import { HttpExceptionFilter } from './exception-filter/http-exception-filter';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { EquipmentModule } from './modules/equipment/equipment.module';
import { PatientModule } from './modules/patient/patient.module';
import { ScriptModule } from './modules/script/script.module';
import { StatisticModule } from './modules/statistic/statistic.module';
import { RedisHelperModule } from './shared/redis-helper/redis-helper.module';
import { SocketModule } from './shared/socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.register(),
    RedisHelperModule,
    ScriptModule,
    AuthModule,
    PatientModule,
    SocketModule,
    EquipmentModule,
    StatisticModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SwaggerConfig,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
