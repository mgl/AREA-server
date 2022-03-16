import {
  Controller,
  Get,
  Request,
  Req,
  Delete,
  Param,
  Body,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getUser(@Req() request: Request): string {
    return 'Hello ' + request['email'] + ' with uid ' + request['uid'];
  }

  @Get('/service_list')
  async getServiceList(@Res() response, @Req() request: Request) {
    return this.appService.getServiceList(response, request);
  }

  @Get('/action_list')
  async getActionList(@Res() response, @Req() request: Request) {
    return this.appService.getActionList(response, request);
  }

  @Get('/reaction_list')
  async getReactionList(
    @Res() response,
    @Req() request: Request,
    @Body('id') id: string,
  ) {
    return this.appService.getReactionList(response, request, id);
  }

  @Delete('/profile')
  async removeActionReaction(
    @Request() req,
    @Param('id') id: string,
    @Param('token') token: string,
  ) {
    return this.appService.removeActionReaction(req, id, token);
  }
}
