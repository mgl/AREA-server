import { Controller, Request, Post, Delete, Param } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import admin from 'firebase-admin';


@Controller('/services/discord')
export class DiscordController {
  @Post('/subscribe')
  subscribe() {
    //if (_url === "") {
    //    _url = "https://discordapp.com/api/webhooks/942802858665971832/QlF86Xa2wrzBscnyyRmvC3qYf8D8l2j4Rw-pLbdZbAPZbc7V6B365tyUDDwqVOOIj2G7";
    //}
    return { message: 'Subscribed to Discord service' };
  }

  @Delete('/unsubscribe')
  unsubscribe() {
    return { message: 'Unsubscribed to Discord service' };
  }

  @Post('/')
  async createDiscordAction(@Param('token') token: string) {
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
  async createDiscordReaction(@Param('id') id: string, @Param('token') token: string) {
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
