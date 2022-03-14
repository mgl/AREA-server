import { Get } from '@nestjs/common';
import { Controller, Request, Post, Delete, Body, Req } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('/services/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}
  @Post('subscribe')
  async subscribe(
    @Req() request: Request,
    @Body('mail') mail: string,
    @Body('password') password: string,
  ) {
    return this.mailService.subscribe(request, mail, password);
  }

  @Get('/')
  async getToken(@Req() request: Request) {
    return this.mailService.getToken(request);
  }

  @Delete('/unsubscribe')
  async unsubscribe(@Req() request: Request) {
    return this.mailService.unsubscribe(request);
  }

  @Post('/action')
  async createMailAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body() token: string,
  ) {
    return this.mailService.createMailAction(request, id, token);
  }

  @Post('/reaction')
  async createMailReaction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('object') object: string,
    @Body('token') token: string,
    @Body('content') content: string,
    @Body('receiver') receiver: string,
  ) {
    return this.mailService.createMailReaction(
      request,
      id,
      actionId,
      object,
      token,
      content,
      receiver,
    );
  }

  @Post('/execute_mail_reaction')
  async executeMailReaction(
    @Req() request: Request,
    @Body('object') object: string,
    @Body('content') content: string,
    @Body('receiver') receiver: string,
  ) {
    return this.mailService.executeMailReaction(
      request,
      object,
      content,
      receiver,
    );
  }
}
