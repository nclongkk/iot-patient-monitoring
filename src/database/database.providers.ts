import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: configService.get('DB_HOST'), // Replace with the appropriate config key
        port: configService.get('DB_PORT'), // Replace with the appropriate config key
        username: configService.get('DB_USERNAME'), // Replace with the appropriate config key
        password: configService.get('DB_PASSWORD'), // Replace with the appropriate config key
        database: configService.get('DB_DATABASE'), // Replace with the appropriate config key
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
    inject: [ConfigService], // Inject the ConfigService
  },
];
