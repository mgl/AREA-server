import {
  Request,
  Post,
  Delete,
  Body,
  Req,
  Get,
  Controller,
} from '@nestjs/common';
import { DiscordService } from './discord.service';

@Controller('/services/discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}
  @Post('subscribe')
  async subscribe(@Req() request: Request, @Body('token') token: string) {
    return this.discordService.subscribe(request, token);
  }

  @Get('/')
  async getToken(@Req() request: Request) {
    return this.discordService.getToken(request);
  }

  @Delete('/unsubscribe')
  async unsubscribe(@Req() request: Request) {
    return this.discordService.unsubscribe(request);
  }

  @Post('/action')
  async createDiscordAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
  ) {
    return this.discordService.createDiscordAction(request, id, token);
  }

  @Post('/classic_reaction')
  async createDiscordClassicReaction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
    @Body('message') message: string,
    @Body('server') server: string,
    @Body('channel') channel: string,
  ) {
    return this.discordService.createDiscordClassicReaction(
      request,
      id,
      actionId,
      token,
      message,
      server,
      channel,
    );
  }
}
