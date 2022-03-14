import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import functions from 'firebase-functions';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DiscordClientInstance } from './reactions/DiscordReaction';
import 'dotenv/config';

// Local test code

const server = express();

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

const bootstrap = async (expressInstance) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );

  app.use(helmet());
  app.use(cookieParser());
  app.enableCors();
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe());

  DiscordClientInstance.sendMessage('', '', '');

  return app.init();
};

if (process.env.NODE_ENV === 'docker') {
  bootstrap_local();
} else {
  bootstrap(server);
  functions.region('europe-west1').https.onRequest(server);
}
