import { Get } from '@nestjs/common';
import { Controller, Request, Post, Delete, Body, Req } from '@nestjs/common';
import Firebase from 'src/firebase/firebase';

const firebase = new Firebase();
@Controller('/services/twitter')
export class TwitterController {
  @Post('subscribe')
  async subscribe(
    @Req() request: Request,
    @Body('appKey') appKey: string,
    @Body('appSecret') appSecret: string,
    @Body('accessToken') accessToken: string,
    @Body('accessSecret') accessSecret: string,
  ) {
    if (!appKey || appKey === undefined)
      return { message: '400 Bad Parameter' };
    if (!appSecret || appSecret === undefined)
      return { message: '400 Bad Parameter' };
    if (!accessSecret || accessSecret === undefined)
      return { message: '400 Bad Parameter' };
    if (!accessToken || accessToken === undefined)
      return { message: '400 Bad Parameter' };

    const empty = {};
    await firebase.getDb().collection('area').doc(request['uid']).set(empty);

    const data = {
      name: 'twitter',
      token: accessToken,
      appKey: appKey,
      appSecret: appSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    };

    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('twitter')
      .set(data);
    return { message: 'Subscribed to twitter service' };
  }

  @Get('/')
  async getToken(@Req() request: Request) {
    const TokenRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('twitter');
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
      .doc('twitter')
      .delete();
    return { message: 'Unsubscribed to twitter service' };
  }

  @Post('/action')
  async createTwitterAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body() token: string,
  ) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc()
      .set({ id: id, token: token, name: 'twitter_action' });
  }

  @Post('/reaction')
  async createTwitterReaction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
  ) {
    if (!id || id == undefined) return { message: '400 Bad Parameter' };
    if (!actionId || actionId == undefined)
      return { message: '400 Bad Parameter' };
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(actionId)
      .collection('reactions')
      .doc()
      .set({ id: id, token: token, name: 'twitter_reaction' });
  }
}
