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
import { ThrottlerModule } from '@nestjs/throttler';
import { PreauthMiddleware } from './auth/preauth.middleware';
import { GithubController } from './github/github.controller';
import { AppController } from './app.controller';

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
    //    GitlabController,
    //    TwitterController,
    //    DiscordController,
    //    GoogleController,
    //    CodebaseController,
  ],
  providers: [AppService, AboutService],
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
