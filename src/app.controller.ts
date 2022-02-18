import { Controller, Get, Request, UseGuards, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

<<<<<<< HEAD
  @Get()
=======
  @Public()
  @Get('/hello')
>>>>>>> controllers
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/hello')
  getUser(@Req() request: Request): string {
    return 'Hello ' + request['email'] + ' with uid ' + request['uid'];
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
