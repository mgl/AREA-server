import { Get } from '@nestjs/common';
import {
  Controller,
  Request,
  Post,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import Firebase from '../firebase/firebase';
import {Token, Id, ActionId} from '../error/error';
import {DiscordReaction} from '../reactions/DiscordReaction'

@Controller('/services/discord')
export class DiscordController {
  @Post('subscribe')
  async subscribe(@Req() request: Request, @Body('token') token: string) {
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    const data = {
      discord_token: token,
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
      .doc('discord')
    const doc = await TokenRef.get()
    if (!doc.exists)
      return { statusCode: '404', message: 'Not found'}
    return {message: '200' + doc.data()};
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
  async createDiscordAction(@Req() request: Request, @Body('id') id: string, @Body('token') token: string) {
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions') 
      .doc()
      .set({id: id, token: token, name: "discord_action"});
   
  }

  @Post('/reaction')
  async createDiscordReaction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
  ) {
    if (!id || id == undefined)
      return { message: '400 Bad Parameter'}
    if (!actionId || actionId == undefined)
      return { message: '400 Bad Parameter'}
    if (!token || token == undefined)
      return { message: '400 Bad Parameter'}
    const actionRef = Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('actions')
    const userNameSnapshot = await actionRef.get();
    userNameSnapshot.forEach(async doc => {
      if (doc.data().userName == actionId) {       
        await Firebase.getInstance()
        .getDb()
        .collection('area')
        .doc('uuid')
        .collection('actions')
        .doc(doc.data().userName)
        .collection('reactions')
        .doc()
        .set({id: id, token: token, name: "discord_reaction"});
        console.log(doc.data().userName)
      }
    });
  }

  @Post('/execute_discord_reaction')
  async executeDiscordReaction(@Req() request: Request, @Body('message') message: string) {
    var discordReaction = new DiscordReaction;
     discordReaction.Message(message, 'https://discord.com/api/webhooks/945680220483092600/ETxK6Iv_y6fN5FI4MSaBIXdZztfqcZEp-rHY0Hatulaer2K_uT-wktGrpDNgLqkad0sm');      
  }
}
