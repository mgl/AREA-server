import { Get, Res } from '@nestjs/common';
import { Controller, Request, Post, Delete, Body, Req } from '@nestjs/common';
import { MailService } from './mail.service';
import { Response } from 'express';

@Controller('/services/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Post('subscribe')
  async subscribe(
    @Res() res: Response,
    @Req() request: Request,
    @Body('username') mail: string,
    @Body('appPassword') password: string,
  ) {
    return this.mailService.subscribe(res, request, mail, password);
  }

  @Get('/')
  async getToken(@Req() request: Request) {
    return this.mailService.getToken(request);
  }

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
