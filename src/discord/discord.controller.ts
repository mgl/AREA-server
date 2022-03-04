import { Controller, Request, Post, Delete, Param, Get, Body } from '@nestjs/common';
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';
import { FirebaseAdmin } from 'src/firebase-admin/firebase-admin';

@Controller('/services/discord')
export class DiscordController {
  @Post('/subscribe')
  subscribe(@Param('token') token: string) {
    const auth = getAuth();
    const user = auth.currentUser;

    var ref = FirebaseAdmin.getInstance().getAdmin().database().ref().child(user.uid);
    ref.set({
      discord_token: token
    })
    return { message: 'Subscribed to Discord service' };
  }

  @Delete('/unsubscribe')
  unsubscribe() {
    const auth = getAuth();
    const user = auth.currentUser;

    var ref = FirebaseAdmin.getInstance().getAdmin().database().ref().child(user.uid);
    ref.set({
      discord_token: null
    })
    return { message: 'Unsubscribed to Discord service' };
  }

@Post('/action')
  async createDiscordAction(@Body() token: string) {
    const data = {
        token: "",
    };
    data.token = token;
    const res = await FirebaseAdmin.getInstance()
      .getAdmin()
      .firestore()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc()
      .set(data);
    return res;
  }

  @Post('/reaction')
  async createDiscordReaction(
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
  ) {
    const data = {
        id: "",
        token: "",
    };
    data.id = id;
    data.token = token;
    const res = await FirebaseAdmin.getInstance()
      .getAdmin()
      .firestore()
      .collection('area')
      .doc("uuid")
      .collection('actions')
      .doc(actionId)
      .collection('reactions')
      .doc()
      .set(data);
    return res;
  }
}
