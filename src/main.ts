import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as functions from 'firebase-functions';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

const server = express();

// Local test code
/*
async function bootstrap_local() {
  const app = await NestFactory.create(AppModule);

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
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}

bootstrap_local();
*/
// Production code
const bootstrap = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.use(helmet());
  app.use(cookieParser());
  app.enableCors();
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe())
  return app.init();
};

bootstrap(server);
export const api = functions.region('europe-west1').https.onRequest(server);
