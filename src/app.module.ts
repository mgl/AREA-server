import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AboutController } from './about/about.controller';
import { AboutService } from './about/about.service';
import { AppService } from './app.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { PreauthMiddleware } from './auth/preauth.middleware';
import { GithubController } from './github/github.controller';
import { GithubService } from './github/github.service';
import { GitlabService } from './gitlab/gitlab.service';
import { CodebaseService } from './codebase/codebase.service';
import { AppController } from './app.controller';
import { GitlabController } from './gitlab/gitlab.controller';
import { TwitterController } from './twitter/twitter.controller';
import { DiscordController } from './discord/discord.controller';
import { GoogleController } from './google/google.controller';
import { CodebaseController } from './codebase/codebase.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
  controllers: [
    AppController,
    AboutController,
    GithubController,
    GitlabController,
    TwitterController,
    DiscordController,
    GoogleController,
    CodebaseController,
  ],
  providers: [
    AppService,
    AboutService,
    GithubService,
    GitlabService,
    CodebaseService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PreauthMiddleware)
      .exclude(
        { path: '/hello', method: RequestMethod.GET },
        { path: '/api', method: RequestMethod.GET },
        { path: '/services/github/webhook', method: RequestMethod.POST },
        { path: '/services/twitter/webhook', method: RequestMethod.POST },
        { path: '/services/discord/webhook', method: RequestMethod.POST },
        { path: '/services/google/webhook', method: RequestMethod.POST },
        { path: '/services/gitlab/webhook', method: RequestMethod.POST },
        { path: '/services/codebase/webhook', method: RequestMethod.POST },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
