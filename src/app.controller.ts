import { Controller, Get, Request, UseGuards, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/hello')
  getUser(@Req() request: Request): string {
    return 'Hello ' + request['user']?.email + '!';
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
