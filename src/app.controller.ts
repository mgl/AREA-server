import { Controller, Get, Request, Req, Delete, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/hello')
  getUser(@Req() request: Request): string {
    return 'Hello ' + request['email'] + ' with uid ' + request['uid'];
  }

  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('/profile')
  getActionList(@Request() req) {
    return req.user.actions;
  }

  @Delete('/profile')
  async removeActionReaction(
    @Request() req,
    @Param('id') id: string,
    @Param('token') token: string,
  ) {
    const docRef = await req
      .firestore()
      .collection('actions')
      .doc(token)
      .collection('reactions')
      .doc(id)
      .delete();
    return 'Action deleted';
  }
}
