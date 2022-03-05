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
@Controller('/services/gitlab')
export class GitlabController {
  @Post('subscribe')
  async subscribe(@Req() request: Request, @Body('token') token: Token) {
    const data = {
      gitlab_token: token,
    };

    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('users')
      .doc(request['uid'])
      .set(data);
    return { message: 'Subscribed to gitlab service' };
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
  async unsubscribe() {
    const user = Firebase.getInstance().getAuth().currentUser;

    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('users')
      .doc(user.uid)
      .delete();
    return { message: 'Unsubscribed to gitlab service' };
  }

  @Post('/action')
  async createGitlabAction(@Body() token: Token) {
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
  async createGitlabReaction(
    @Body('id') id: Id,
    @Body('actionId') actionId: ActionId,
    @Body('token') token: Token,
  ) {
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

}
