import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AboutController } from './about/about.controller';
import { AboutService } from './about/about.service';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { PreauthMiddleware } from './auth/preauth.middleware';

@Module({
  imports: [ThrottlerModule.forRoot({
    ttl: 60,
    limit: 10,
  }), UsersModule],
  controllers: [AppController, AboutController],
  providers: [AppService, AboutService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreauthMiddleware).forRoutes({
      path: '*', method: RequestMethod.ALL
    });
  }
}