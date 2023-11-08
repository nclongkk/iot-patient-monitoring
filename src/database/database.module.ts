// database.module.ts

import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { databaseProviders } from './database.providers';
import { AppRepository } from './database.repository';
import { Entities } from './entities';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [...databaseProviders, AppRepository],
  exports: [...databaseProviders, AppRepository],
})
export class DatabaseModule {
  static register(): DynamicModule {
    const repositoryProviders = Entities.map((entity) => ({
      provide: entity.name.toUpperCase() + '_REPOSITORY',
      useFactory: (dataSource: DataSource) => dataSource.getRepository(entity),
      inject: ['DATA_SOURCE'],
    }));
    return {
      module: DatabaseModule,
      providers: [...repositoryProviders],
    };
  }
}
