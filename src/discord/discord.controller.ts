import {
  Request,
  Post,
  Delete,
  Body,
  Req,
  Get,
  Controller,
  Res,
} from '@nestjs/common';
import { DiscordService } from './discord.service';
import { Response } from 'express';

@Controller('/services/discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}
  @Post('subscribe')
  async subscribe(
    @Res() res: Response,
    @Req() request: Request,
    @Body('token') token: string,
  ) {
    return this.discordService.subscribe(res, request, token);
  }

  @Get('/')
  async getToken(@Req() request: Request) {
    return this.discordService.getToken(request);
  }

  @Delete('/unsubscribe')
  async unsubscribe(@Res() res: Response, @Req() request: Request) {
    return this.discordService.unsubscribe(res, request);
  }

  @Post('/action')
  async createDiscordAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
  ) {
    return this.discordService.createDiscordAction(request, id, token);
  }

  @Post('/reaction/message')
  async createDiscordClassicReaction(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
    @Body('message') message: string,
    @Body('server') server: string,
    @Body('channel') channel: string,
  ) {
    return this.discordService.createDiscordClassicReaction(
      res,
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
