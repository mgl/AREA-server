import Firebase from 'src/firebase/firebase';
import { Injectable } from '@nestjs/common';

const firebase = new Firebase();

@Injectable()
export class TwitterService {
  async subscribe(
    request: any,
    accessToken: string,
    accessPassword: string,
    appKeyToken: string,
    appPassword: string,
  ) {
    if (!accessToken || accessToken === undefined)
      return { message: '400 Bad Parameter' };

    const empty = {};
    await firebase.getDb().collection('area').doc(request['uid']).set(empty);

    const data = {
      name: 'twitter',
      token: accessToken,
      accessSecret: accessPassword,
      appKeyToken: appKeyToken,
      appSecret: appPassword,
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

  async getToken(request: any) {
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

  async unsubscribe(request: any) {
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('twitter')
      .delete();
    return { message: 'Unsubscribed to twitter service' };
  }

  async createTwitterAction(request: any, id: string, token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc()
      .set({ id: id, token: token, name: 'twitter_action' });
  }

  async createTwitterTweet(
    request: any,
    id: string,
    actionId: string,
    token: string,
    message: string,
  ) {
    if (!id || id == undefined) return { message: '400 Bad Parameter' };
    if (!actionId || actionId == undefined)
      return { message: '400 Bad Parameter' };
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    let accessToken = '';
    let accessSecret = '';
    let appKeyToken = '';
    let appSecret = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const servicesSnapshot = await serviceRef.get();
    servicesSnapshot.forEach(async (doc) => {
      if (doc.data().name == 'twitter') {
        accessToken = doc.data().token;
        accessSecret = doc.data().accessSecret;
        appKeyToken = doc.data().appKeyToken;
        appSecret = doc.data().appSecret;
      }
    });
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(actionId)
      .collection('reactions')
      .doc()
      .set({
        id: id,
        token: token,
        name: 'twitter_tweet',
        message: message,
        accessToken: accessToken,
        accessSecret: accessSecret,
        appKeyToken: appKeyToken,
        appSecret: appSecret,
      });
    return { message: 'Twitter tweet action created' };
  }

  async createTwitterFollow(
    request: any,
    id: string,
    actionId: string,
    token: string,
    user: string,
  ) {
    if (!id || id == undefined) return { message: '400 Bad Parameter' };
    if (!actionId || actionId == undefined)
      return { message: '400 Bad Parameter' };
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    let accessToken = '';
    let accessSecret = '';
    let appKeyToken = '';
    let appSecret = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const servicesSnapshot = await serviceRef.get();
    servicesSnapshot.forEach(async (doc) => {
      if (doc.data().name == 'twitter') {
        accessToken = doc.data().token;
        accessSecret = doc.data().accessSecret;
        appKeyToken = doc.data().appKeyToken;
        appSecret = doc.data().appSecret;
      }
    });
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(actionId)
      .collection('reactions')
      .doc()
      .set({
        id: id,
        token: token,
        name: 'twitter_follow',
        user: user,
        accessToken: accessToken,
        accessSecret: accessSecret,
        appKeyToken: appKeyToken,
        appSecret: appSecret,
      });
    return { message: 'Twitter follow action created' };
  }

  async createTwitterRetweet(
    request: any,
    id: string,
    actionId: string,
    token: string,
    tweetId: string,
  ) {
    if (!id || id == undefined) return { message: '400 Bad Parameter' };
    if (!actionId || actionId == undefined)
      return { message: '400 Bad Parameter' };
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    let accessToken = '';
    let accessSecret = '';
    let appKeyToken = '';
    let appSecret = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const servicesSnapshot = await serviceRef.get();
    servicesSnapshot.forEach(async (doc) => {
      if (doc.data().name == 'twitter') {
        accessToken = doc.data().token;
        accessSecret = doc.data().accessSecret;
        appKeyToken = doc.data().appKeyToken;
        appSecret = doc.data().appSecret;
      }
    });
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(actionId)
      .collection('reactions')
      .doc()
      .set({
        id: id,
        token: token,
        name: 'twitter_retweet',
        tweetId: tweetId,
        accessToken: accessToken,
        accessSecret: accessSecret,
        appKeyToken: appKeyToken,
        appSecret: appSecret,
      });
    return { message: 'Twitter retweet action created' };
  }
  async createTwitterLike(
    request: any,
    id: string,
    actionId: string,
    token: string,
    tweetId: string,
  ) {
    if (!id || id == undefined) return { message: '400 Bad Parameter' };
    if (!actionId || actionId == undefined)
      return { message: '400 Bad Parameter' };
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    let accessToken = '';
    let accessSecret = '';
    let appKeyToken = '';
    let appSecret = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const servicesSnapshot = await serviceRef.get();
    servicesSnapshot.forEach(async (doc) => {
      if (doc.data().name == 'twitter') {
        accessToken = doc.data().token;
        accessSecret = doc.data().accessSecret;
        appKeyToken = doc.data().appKeyToken;
        appSecret = doc.data().appSecret;
      }
    });
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(actionId)
      .collection('reactions')
      .doc()
      .set({
        id: id,
        token: token,
        name: 'twitter_like',
        tweetId: tweetId,
        accessToken: accessToken,
        accessSecret: accessSecret,
        appKeyToken: appKeyToken,
        appSecret: appSecret,
      });
    return { message: 'Twitter like action created' };
  }
}
