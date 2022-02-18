import { Module } from '@nestjs/common';
import { AboutController } from './about/about.controller';
import { AboutService } from './about/about.service';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { GithubController } from './github/github.controller';
import { OneDriveController } from './one-drive/one-drive.controller';
import { TwitterController } from './twitter/twitter.controller';
import { DiscordController } from './discord/discord.controller';

@Module({
  imports: [ThrottlerModule.forRoot({
    ttl: 60,
    limit: 10,
  }), AuthModule, UsersModule],
  controllers: [AppController, AboutController, GithubController, OneDriveController, TwitterController, DiscordController],
  providers: [AppService, AboutService, {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  }],
})
export class AppModule {}
