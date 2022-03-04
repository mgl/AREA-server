import { Controller, Request, Post, Delete, Param, Get, Body } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { FirebaseAdmin } from 'src/firebase-admin/firebase-admin';
import { getAuth } from "firebase/auth";

@Controller('/services/github')
export class GithubController {
  
  @Post('subscribe')
  subscribe(@Param('token') token: string) {
    const auth = getAuth();
    const user = auth.currentUser;

    var ref = FirebaseAdmin.getInstance().getAdmin().database().ref().child(user.uid);
    ref.set({
      github_token: token
    })
    return { message: 'Subscribed to Github service' };
  }

  @Delete('/unsubscribe')
  unsubscribe() {
    const auth = getAuth();
    const user = auth.currentUser;

    var ref = FirebaseAdmin.getInstance().getAdmin().database().ref().child(user.uid);
    ref.set({
      github_token: null
    })
    return { message: 'Unsubscribed to Github service' };
  }

  @Post('/action')
  async createGithubAction(@Body() token: string) {
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
  async createGithubReaction(
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

  @Post('/webhook')
  async React(@Request() request) {
      console.log(request);
  }
}
