import type { INestApplication } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Injectable()
export class SwaggerConfig {
  constructor(private configService: ConfigService) {}

  public setupSwagger(app: INestApplication): void {
    if (this.configService.get('SWAGGER_MODE') === 'on') {
      const config = new DocumentBuilder()
        .setTitle('IOT PATIENT MONITORING APIS')
        .setDescription('API docs, lets go! my stupid heart, dont know...')
        .setVersion('2.0')
        .addBearerAuth()
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('/api/doc', app, document, {
        swaggerOptions: {
          filter: true,
          tagsSorter: 'alpha',
          operationsSorter: 'alpha',
          persistAuthorization: true,
        },
      });
    }
  }
}
