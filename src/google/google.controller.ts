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
@Controller('/services/google')
export class GoogleController {
  @Post('subscribe')
  async subscribe(@Req() request: Request, @Body('token') token: string) {
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    const data = {
      google_token: token,
    };

    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('users')
      .doc(request['uid'])
      .set(data);
    return { message: 'Subscribed to google service' };
  }

  @Get('/')
  async getToken(@Req() request: Request) {
    const TokenRef = Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('users')
      .doc(request['uid'])
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
      .doc('uuid')
      .collection('users')
      .doc(request['uid'])
      .delete();
    return { message: 'Unsubscribed to google service' };
  }

  @Post('/action')
  async createGoogleAction(@Body('id') id: string, @Body() token: string) {
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc()
      .set({id: id, token: token, name: "google_action"});
  }

  @Post('/reaction')
  async createGoogleReaction(
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
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc(actionId)
      .collection('reactions')
      .doc()
      .set({id: id, token: token, name: "google_reaction"});
  }
}
