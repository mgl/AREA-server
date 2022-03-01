import { Controller, Request, Post, Delete, Param } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import admin from 'firebase-admin';
import { getAnalytics, setUserProperties } from "firebase/analytics";

@Controller('/services/github')
export class GithubController {
  @Post('subscribe')
  subscribe(@Param('token') token: string) {
    const analytics = getAnalytics();

    setUserProperties(analytics, { github_token: token });
    return { message: 'Subscribed to Github service' };
  }

  @Delete('/unsubscribe')
  unsubscribe() {
    return { message: 'Unsubscribed to Github service' };
  }

  @Post('/')
  async createGithubAction(@Param('token') token: string) {
    const data = {
      token: token,
    };
    const res = await admin
      .firestore()
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
    const res = await admin
      .firestore()
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
