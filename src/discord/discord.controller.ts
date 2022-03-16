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
import { ApiOperation } from '@nestjs/swagger';

@Controller('/services/discord')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}
  @ApiOperation({
    summary: 'Subscribe to Discord',
    description: 'Subscribe to Discord with his authentification token',
  })
  @Post('subscribe')
  async subscribe(
    @Res() res: Response,
    @Req() request: Request,
    @Body('token') token: string,
  ) {
    return this.discordService.subscribe(res, request, token);
  }

  @ApiOperation({
    summary: 'Get discord service token',
    description: 'Get discord service token',
  })
  @Get('/')
  async getToken(@Req() request: Request) {
    return this.discordService.getToken(request);
  }

  @ApiOperation({
    summary: 'Unsubscribe to discord service',
    description: 'Unsubscribe to discord service',
  })
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

  @ApiOperation({
    summary: 'discord message reaction',
    description:
      'Create discord message reaction with his id, his token, the id of his linked action, his message and the channel and the server where the message will be written',
  })
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
