import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/exception.filter';
import { apiVersion } from './shared';
import { appName } from './shared/constants/constants';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const PORT = process.env.APP_PORT || 3000;
  const globalPrefix = 'api';

  // Swagger Integration
  const serverURL = process.env.SERVER_URL || 'http://localhost';
  const server = process.env.NODE_ENV.includes('production')
    ? `${serverURL}/${globalPrefix}`
    : `${serverURL}/${globalPrefix}`;
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(`${appName}`)
    .setDescription(`Exposed Endpoints for ${appName}`)
    .addServer(server, 'Local environment')
    .addTag('EMR', 'EMR API')
    .setVersion(apiVersion)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api-docs', app, document);

  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());

  // add this as other post with content-type: json will fail like login will fail due to bodyParser code above
  app.use(bodyParser.json());

  // Pipes
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS
  const corsOptions: CorsOptions = {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: '*',
    credentials: true,
  };

  app.enableCors(corsOptions);
  app.use(helmet());

  // validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );
  await app.listen(PORT);
  Logger.log(`🚀 ${appName} is running on ${server}`);
}

bootstrap();
