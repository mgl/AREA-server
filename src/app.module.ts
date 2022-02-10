import { Module } from '@nestjs/common';
import { AboutController } from './about/about.controller';
import { AboutService } from './about/about.service';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AppController, AboutController],
  providers: [AppService, AboutService],
})
export class AppModule {}
