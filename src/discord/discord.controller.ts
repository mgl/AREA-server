import {
  Request,
  Post,
  Delete,
  Body,
  Req,
  Get,
  Controller,
} from '@nestjs/common';
import Firebase from '../firebase/firebase';
import { DiscordReaction } from '../reactions/DiscordReaction';

@Controller('/services/discord')
export class DiscordController {
  @Post('subscribe')
  async subscribe(@Req() request: Request, @Body('token') token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    const data = {
      token: token,
      name: 'discord',
    };

    await Firebase.getInstance()
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
    const TokenRef = Firebase.getInstance()
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
    await Firebase.getInstance()
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
    await Firebase.getInstance()
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
            name: 'discord_classic_reaction',
            message: message,
          });
      }
    });
  }

  @Post('/success_reaction')
  async createDiscordSuccessReaction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
    @Body('message') message: string,
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
            name: 'discord_success_reaction',
            message: message,
          });
      }
    });
  }

  @Post('/error_reaction')
  async createDiscordErrorReaction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
    @Body('message') message: string,
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
            name: 'discord_error_reaction',
            message: message,
          });
      }
    });
  }
  @Post('/info_reaction')
  async createDiscordInfoReaction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
    @Body('message') message: string,
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
            name: 'discord_info_reaction',
            message: message,
          });
      }
    });
  }

  @Post('/warn_reaction')
  async createDiscordWarnReaction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
    @Body('message') message: string,
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
            name: 'discord_warn_reaction',
            message: message,
          });
      }
    });
  }

  @Post('/execute_discord_classic_reaction')
  async executeDiscordClassicReaction(
    @Req() request: Request,
    @Body('message') message: string,
  ) {}

  @Post('/execute_discord_success_reaction')
  executeDiscordSuccessReaction(
    @Req() request: Request,
    @Body('message') message: string,
  ) {}

  @Post('/execute_discord_error_reaction')
  async executeDiscordErrorReaction(
    @Req() request: Request,
    @Body('message') message: string,
  ) {}

  @Post('/execute_discord_info_reaction')
  async executeDiscordInfoReaction(
    @Req() request: Request,
    @Body('message') message: string,
  ) {}

  @Post('/execute_discord_warn_reaction')
  async executeDiscordWarnReaction(
    @Req() request: Request,
    @Body('message') message: string,
  ) {}
}
