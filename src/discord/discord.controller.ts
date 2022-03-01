import { Controller, Request, Post, Delete, Param } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import admin from 'firebase-admin';
import { getAnalytics, setUserProperties } from "firebase/analytics";

@Controller('/services/discord')
export class DiscordController {
  @Post('/subscribe')
  subscribe(@Param('token') token: string) {
    const analytics = getAnalytics();

    setUserProperties(analytics, { discord_token: token });
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
  async createDiscordReaction(
    @Param('id') id: string,
    @Param('token') token: string,
  ) {
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
