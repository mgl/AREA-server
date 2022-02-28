import { Controller, Request, Post, Delete, Param } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import admin from 'firebase-admin';

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
  async createTwitterAction(@Param('token') token: string) {
    const data = {
      token: token,
    };
    const res = await admin
      .firestore()
      .collection('actions')
      .doc(uuidv4())
      .set(data);
    return res;
  }

  @Post('/')
  async createTwitterReaction(@Param('id') id: string, @Param('token') token: string) {
    const data = {
      token: token,
    };
    const res = await admin
      .firestore()
      .collection('actions')
      .doc(id)
      .collection('reactions')
      .doc(uuidv4())
      .set(data);
    return res;
  }
}
