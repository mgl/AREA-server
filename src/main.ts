import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as functions from 'firebase-functions';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();

const bootstrap = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.use(helmet());
  app.use(cookieParser());
  app.enableCors();
  app.use(compression());

  const config = new DocumentBuilder()
    .setTitle('AREA API')
    .setDescription('AREA Application Server API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  return app.init();
};

bootstrap(server);

export const api = functions.region('europe-west1').https.onRequest(server);
