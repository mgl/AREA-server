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
@Controller('/services/github')
export class GithubController {
 @Post('subscribe')
  async subscribe(@Req() request: Request, @Body('token') token: string) {
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    const data = {
      github_token: token,
    };

    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('users')
      .doc(request['uid'])
      .set(data);
    return { message: 'Subscribed to github service' };
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
    return { message: 'Unsubscribed to github service' };
  }

  @Post('/action')
  async createGithubAction(@Body() token: string) {
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    const data = {
      token: token,
    };
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc()
      .set(data);
  }

  @Post('/reaction')
  async createGithubReaction(
    @Body('id') id: Id,
    @Body('actionId') actionId: ActionId,
    @Body('token') token: Token,
  ) {
    if (!id || id === undefined)
      return { message: '400 Bad Parameter'}
    if (!actionId || actionId === undefined)
      return { message: '400 Bad Parameter'}
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    const data = {
      id: id,
      token: token,
    };
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc(actionId.actionId)
      .collection('reactions')
      .doc()
      .set(data);
  }

  @Post('/webhook')
  async React(@Request() request) {
    console.log(request);
  }
}
