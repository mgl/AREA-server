import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AboutController } from './about/about.controller';
import { AboutService } from './about/about.service';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { ThrottlerModule } from '@nestjs/throttler';
<<<<<<< HEAD
import { PreauthMiddleware } from './auth/preauth.middleware';
=======
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { GithubController } from './github/github.controller';
import { OneDriveController } from './one-drive/one-drive.controller';
import { TwitterController } from './twitter/twitter.controller';
import { DiscordController } from './discord/discord.controller';
>>>>>>> controllers

@Module({
  imports: [ThrottlerModule.forRoot({
    ttl: 60,
    limit: 10,
<<<<<<< HEAD
  }), UsersModule],
  controllers: [AppController, AboutController],
  providers: [AppService, AboutService],
=======
  }), AuthModule, UsersModule],
  controllers: [AppController, AboutController, GithubController, OneDriveController, TwitterController, DiscordController],
  providers: [AppService, AboutService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }],
>>>>>>> controllers
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreauthMiddleware).forRoutes({
      path: '*', method: RequestMethod.ALL
    });
  }
}