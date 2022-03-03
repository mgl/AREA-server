import { Controller, Request, Post, Delete, Param } from '@nestjs/common';
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';
import admin from 'firebase-admin';

@Controller('/services/github')
export class GithubController {
  @Post('subscribe')
  subscribe(@Param('token') token: string) {
    const auth = getAuth();
    const user = auth.currentUser;

    var ref = admin.database().ref().child(user.uid);
    ref.set({
      github_token: token
    })
    return { message: 'Subscribed to Github service' };
  }

  @Delete('/unsubscribe')
  unsubscribe() {
    const auth = getAuth();
    const user = auth.currentUser;

    var ref = admin.database().ref().child(user.uid);
    ref.set({
      github_token: null
    })
    return { message: 'Unsubscribed to Github service' };
  }

  @Post('/')
  async createGithubAction(@Param('token') token: string) {
    const data = {
      token: token,
    };
    const auth = getAuth();
    const user = auth.currentUser;

    const res = await admin
      .firestore()
      .collection('area')
      .doc(user.uid)
      .collection('actions')
      .doc(uuidv4())
      .set(data);
    return res;
  }

  @Post('/')
  async createGithubReaction(
    @Param('id') id: string,
    @Param('token') token: string,
  ) {
    const data = {
      token: token,
    };
    const auth = getAuth();
    const user = auth.currentUser;

    const res = await admin
      .firestore()
      .collection('area')
      .doc(user.uid)
      .collection('actions')
      .doc(id)
      .collection('reactions')
      .doc(uuidv4())
      .set(data);
    return res;
  }

  @Post('/webhook')
  async React(@Request() request) {
      console.log(request);
  }
}
