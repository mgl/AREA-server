import { Controller, Request, Post, Delete, Param } from '@nestjs/common';
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';
import admin from 'firebase-admin';

@Controller('/services/discord')
export class DiscordController {
  @Post('/subscribe')
  subscribe(@Param('token') token: string) {
    const auth = getAuth();
    const user = auth.currentUser;

    var ref = admin.database().ref().child(user.uid);
    ref.set({
      discord_token: token
    })
    return { message: 'Subscribed to Discord service' };
  }

  @Delete('/unsubscribe')
  unsubscribe() {
    const auth = getAuth();
    const user = auth.currentUser;

    var ref = admin.database().ref().child(user.uid);
    ref.set({
      discord_token: null
    })
    return { message: 'Unsubscribed to Discord service' };
  }

  @Post('/')
  async createDiscordAction(@Param('token') token: string) {
    const data = {
      token: token,
    };
    const auth = getAuth();
    const user = auth.currentUser;

    const res = await admin
      .firestore()
      .collection('area')
      .doc(user.uid)
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
    const auth = getAuth();
    const user = auth.currentUser;

    const res = await admin
      .firestore()
      .collection('area')
      .doc(user.uid)
      .collection('actions')
      .doc(id)
      .collection('reactions')
      .doc(uuidv4())
      .set(data);
    return res;
  }
}
