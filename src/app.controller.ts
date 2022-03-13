import {
  Controller,
  Get,
  Request,
  Req,
  Delete,
  Param,
  Headers,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { DiscordClientInstance } from './reactions/DiscordReaction';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    DiscordClientInstance.sendMessage('YearEndProject', 'bot-test', 'test');
    return this.appService.getHello();
  }

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
    @Headers('id') id: string,
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
