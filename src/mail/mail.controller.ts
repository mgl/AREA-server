import { Get } from '@nestjs/common';
import { Controller, Request, Post, Delete, Body, Req } from '@nestjs/common';
import { MailReaction } from '../reactions/MailReaction';
import Firebase from '../firebase/firebase';

@Controller('/services/mail')
export class MailController {
  @Post('subscribe')
  async subscribe(@Req() request: Request, @Body('token') token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    const data = {
      name: 'mail',
      token: token,
    };

    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('mail')
      .set(data);
    return { message: 'Subscribed to mail service' };
  }

  @Get('/')
  async getToken(@Req() request: Request) {
    const TokenRef = Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('mail');
    const doc = await TokenRef.get();
    if (!doc.exists) return { statusCode: '404', message: 'Not found' };
    return { message: '200' + doc.data() };
  }

  @Delete('/unsubscribe')
  async unsubscribe(@Req() request: Request) {
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('mail')
      .delete();
    return { message: 'Unsubscribed to mail service' };
  }

  @Post('/action')
  async createMailAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body() token: string,
  ) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc()
      .set({ id: id, token: token, name: 'mail_action' });
  }

  @Post('/reaction')
  async createMailReaction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('object') object: string,
    @Body('token') token: string,
    @Body('content') content: string,
    @Body('reiceiver') reicever: string,
  ) {
    if (!id || id == undefined) return { message: '400 Bad Parameter' };
    if (!actionId || actionId == undefined)
      return { message: '400 Bad Parameter' };
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    const actionRef = Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions');
    const userNameSnapshot = await actionRef.get();
    userNameSnapshot.forEach(async (doc) => {
      console.log(doc.data());
      if (doc.data().userName == actionId) {
        await Firebase.getInstance()
          .getDb()
          .collection('area')
          .doc(request['uid'])
          .collection('actions')
          .doc(doc.data().userName)
          .collection('reactions')
          .doc()
          .set({
            id: id,
            token: token,
            name: 'mail_reaction',
            object: object,
            content: content,
            reicever: reicever,
          });
      }
    });
  }
  @Post('/execute_mail_reaction')
  async executeMailReaction(
    @Req() request: Request,
    @Body('object') object: string,
    @Body('content') content: string,
    @Body('reiceiver') reicever: string,
  ) {
    const mailReaction = new MailReaction();

    mailReaction.send_mail(object, content, reicever);
  }
}
