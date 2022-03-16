import { Get, Res } from '@nestjs/common';
import { Controller, Request, Post, Delete, Body, Req } from '@nestjs/common';
import { MailService } from './mail.service';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';

@Controller('/services/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @ApiOperation({
    summary: 'Subscribe to Mail',
    description: 'Subscribe to Mail with his mail and is password',
  })
  @Post('subscribe')
  async subscribe(
    @Res() res: Response,
    @Req() request: Request,
    @Body('username') mail: string,
    @Body('appPassword') password: string,
  ) {
    return this.mailService.subscribe(res, request, mail, password);
  }

  @ApiOperation({
    summary: 'Get mail service mail',
    description: 'Get mail service mail',
  })
  @Get('/')
  async getToken(@Req() request: Request) {
    return this.mailService.getToken(request);
  }

  @ApiOperation({
    summary: 'Unsubscribe to mail service',
    description: 'Unsubscribe to mail service',
  })
  @Delete('/unsubscribe')
  async unsubscribe(@Res() res: Response, @Req() request: Request) {
    return this.mailService.unsubscribe(res, request);
  }

  @Post('/action')
  async createMailAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body() token: string,
  ) {
    return this.mailService.createMailAction(request, id, token);
  }

  @ApiOperation({
    summary: 'mail message reaction',
    description:
      'Create mail message reaction with his id, his token, the id of his linked action, his message content, his message object and the receiver',
  })
  @Post('/reaction/mail')
  async createMailReaction(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('object') object: string,
    @Body('token') token: string,
    @Body('content') content: string,
    @Body('receiver') receiver: string,
  ) {
    return this.mailService.createMailReaction(
      res,
      request,
      id,
      actionId,
      object,
      token,
      content,
      receiver,
    );
  }
}
