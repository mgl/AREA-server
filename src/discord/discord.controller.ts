import {
  Request,
  Post,
  Delete,
  Body,
  Req,
  Get,
  Controller,
} from '@nestjs/common';
import Firebase from 'src/firebase/firebase';

const firebase = new Firebase();

@Controller('/services/discord')
export class DiscordController {
  @Post('subscribe')
  async subscribe(@Req() request: Request, @Body('token') token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    const data = {
      token: token,
      name: 'discord',
    };
    const empty = {};
    await firebase.getDb().collection('area').doc(request['uid']).set(empty);

    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('discord')
      .set(data);
    return { message: 'Subscribed to discord service' };
  }

  @Get('/')
  async getToken(@Req() request: Request) {
    const TokenRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('discord');
    const doc = await TokenRef.get();
    if (!doc.exists) return { statusCode: '404', message: 'Not found' };
    return { message: '200' + doc.data() };
  }

  @Delete('/unsubscribe')
  async unsubscribe(@Req() request: Request) {
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('discord')
      .delete();
    return { message: 'Unsubscribed to discord service' };
  }

  @Post('/action')
  async createDiscordAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
  ) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc()
      .set({ id: id, token: token, name: 'discord_action' });
  }

  @Post('/classic_reaction')
  async createDiscordClassicReaction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
    @Body('message') message: string,
    @Body('server') server: string,
    @Body('channel') channel: string,
  ) {
    if (!id || id == undefined) return { message: '400 Bad Parameter' };
    if (!actionId || actionId == undefined)
      return { message: '400 Bad Parameter' };
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    const actionRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions');
    const userNameSnapshot = await actionRef.get();
    userNameSnapshot.forEach(async (doc) => {
      console.log(doc.data().id);
      console.log(actionId);
      if (doc.data().id == actionId) {
        await firebase
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
            name: 'discord_classic_reaction',
            message: message,
            server: server,
            channel: channel,
          });
      }
    });
  }
}
