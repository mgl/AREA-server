import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AboutController } from './about/about.controller';
import { AboutService } from './about/about.service';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { PreauthMiddleware } from './auth/preauth.middleware';
import { GithubController } from './github/github.controller';
import { OneDriveController } from './one-drive/one-drive.controller';
import { TwitterController } from './twitter/twitter.controller';
import { DiscordController } from './discord/discord.controller';
import { GoogleController } from './google/google.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    UsersModule,
  ],
  controllers: [
    AppController,
    AboutController,
    GithubController,
    OneDriveController,
    TwitterController,
    DiscordController,
    GoogleController,
  ],
  providers: [AppService, AboutService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PreauthMiddleware)
      .exclude(
        { path: '/hello', method: RequestMethod.GET },
        { path: '/services/github/webhook', method: RequestMethod.POST },
        { path: '/services/twitter/webhook', method: RequestMethod.POST },
        { path: '/services/discord/webhook', method: RequestMethod.POST },
        { path: '/services/google/webhook', method: RequestMethod.POST },
        { path: '/services/onedrive/webhook', method: RequestMethod.POST },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
