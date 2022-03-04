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
@Controller('/services/github')
export class GithubController {
  @Post('subscribe')
  async subscribe(@Req() request: Request, @Body('token') token: string) {
    const data = {
      github_token: token,
    };
    //data.github_token = token;

    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('users')
      .doc(request['uid'])
      .set(data);
    return { message: 'Subscribed to Github service' };
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
    return { message: 'Unsubscribed to Github service' };
  }

  @Post('/action')
  async createGithubAction(@Body() token: string) {
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
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
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
      .doc(actionId)
      .collection('reactions')
      .doc()
      .set(data);
  }

  @Post('/webhook')
  async React(@Request() request) {
    console.log(request);
  }
}
