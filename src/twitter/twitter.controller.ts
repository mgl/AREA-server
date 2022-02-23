import { Controller, Request, Post, Delete, Param } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Controller('/services/twitter')
export class TwitterController {
  @Post('subscribe')
  subscribe() {
    return { message: 'Subscribed to Twitter service' };
  }

  @Delete('/unsubscribe')
  unsubscribe() {
    return { message: 'Unsubscribed to Twitter service' };
  }

  @Post('/')
  async createTwitterAction(@Request() req) {
    const token = 'ahah';
    const data = {
      token: token,
    };
    const res = await req
      .firestore()
      .collection('actions')
      .doc(uuidv4())
      .set(data);
    return res;
  }

  @Post('/')
  async createTwitterReaction(@Request() req, @Param('id') id: string) {
    const token = 'ahah';
    const data = {
      token: token,
    };
    const res = await req
      .firestore()
      .collection('actions')
      .doc(id)
      .collection('reactions')
      .doc(uuidv4())
      .set(data);
    return res;
  }
}
