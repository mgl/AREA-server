import Firebase from 'src/firebase/firebase';
import { Injectable } from '@nestjs/common';

const firebase = new Firebase();

@Injectable()
export class TwitterService {
  async subscribe(request: any, accessToken: string) {
    if (!accessToken || accessToken === undefined)
      return { message: '400 Bad Parameter' };

    const empty = {};
    await firebase.getDb().collection('area').doc(request['uid']).set(empty);

    const data = {
      name: 'twitter',
      accessToken: accessToken,
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
        name: 'twitter_reaction',
        message: message,
      });
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
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(actionId)
      .collection('reactions')
      .doc()
      .set({ id: id, token: token, name: 'twitter_reaction', user: user });
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
        name: 'twitter_reaction',
        tweetId: tweetId,
      });
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
        name: 'twitter_reaction',
        tweetId: tweetId,
      });
  }
}
