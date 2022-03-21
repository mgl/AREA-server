import { Firebase } from '../firebase/firebase';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';

const firebase = new Firebase();

@Injectable()
export class TwitterService {
  async subscribe(
    res: Response,
    request: Request,
    accessToken: string,
    accessPassword: string,
    appKeyToken: string,
    appPassword: string,
  ) {
    if (!accessToken || accessToken === undefined) {
      return res.status(400).send('Invalid accessToken');
    }
    if (!accessPassword || accessPassword === undefined) {
      return res.status(400).send('Invalid accessPassword');
    }
    if (!appKeyToken || appKeyToken === undefined) {
      return res.status(400).send('Invalid appKeyToken');
    }
    if (!appPassword || appPassword === undefined) {
      return res.status(400).send('Invalid appPassword');
    }
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
    return res.status(201).send('Subscribed to twitter service');
  }

  async getToken(request: Request) {
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

  async unsubscribe(res: Response, request: Request) {
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('twitter')
      .delete();
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('reactions')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().name.includes('twitter')) {
            doc.ref.delete();
          }
        });
        return res.status(201).send('Unsubscribe from twitter service');
      })
      .catch(() => {
        return res.status(400).send('Error unsubscribing');
      });
  }

  async createTwitterAction(request: Request, id: string, token: string) {
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
    res: Response,
    request: Request,
    id: string,
    actionId: string,
    token: string,
    message: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid Id');
    }
    if (!actionId || actionId === undefined) {
      return res.status(400).send('Invalid actionId');
    }
    if (!message || message === undefined) {
      return res.status(400).send('Invalid message');
    }
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
    return res.status(201).send('Twitter tweet reaction created');
  }

  async createTwitterFollow(
    res: Response,
    request: Request,
    id: string,
    actionId: string,
    token: string,
    user: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid Id');
    }
    if (!actionId || actionId === undefined) {
      return res.status(400).send('Invalid actionId');
    }
    if (!user || user === undefined) {
      return res.status(400).send('Invalid user');
    }
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
    return res.status(201).send('Twitter follow reaction created');
  }

  async createTwitterRetweet(
    res: Response,
    request: Request,
    id: string,
    actionId: string,
    token: string,
    tweetId: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid Id');
    }
    if (!actionId || actionId === undefined) {
      return res.status(400).send('Invalid actionId');
    }
    if (!tweetId || tweetId === undefined) {
      return res.status(400).send('Invalid tweetId');
    }
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
    return res.status(201).send('Twitter retweet reaction created');
  }

  async createTwitterLike(
    res: Response,
    request: Request,
    id: string,
    actionId: string,
    token: string,
    tweetId: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid Id');
    }
    if (!actionId || actionId === undefined) {
      return res.status(400).send('Invalid actionId');
    }
    if (!tweetId || tweetId === undefined) {
      return res.status(400).send('Invalid tweetId');
    }
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
    return res.status(201).send('Twitter like reaction created');
  }
}
