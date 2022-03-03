import { Controller, Request, Get, Post, Delete, Param } from '@nestjs/common';
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';
import admin from 'firebase-admin';

@Controller('/services/one-drive')
export class GitlabController {
  @Post('/subscribe')
  subscribe(@Param('token') token: string) {
    const auth = getAuth();
    const user = auth.currentUser;

    var ref = admin.database().ref().child(user.uid);
    ref.set({
      gitlab_token: token
    })
    return { message: 'Subscribed to Gitlab service' };
  }

  @Delete('/unsubscribe')
  unsubscribe() {
    const auth = getAuth();
    const user = auth.currentUser;

    var ref = admin.database().ref().child(user.uid);
    ref.set({
      gitlab_token: null
    })
    return { message: 'Unsubscribed to Gitlab service' };
  }

  @Post('/')
  async createGitlabAction(@Param('token') token: string) {
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
  async createGitlabReaction(
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
}
