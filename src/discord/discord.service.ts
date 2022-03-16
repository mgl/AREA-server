import Firebase from 'src/firebase/firebase';
import { Injectable, Request } from '@nestjs/common';
import { Response } from 'express';

const firebase = new Firebase();

@Injectable()
export class DiscordService {
  async subscribe(res: Response, request: Request, token: string) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    const data = {
      token: token,
      name: 'discord',
    };
    const empty = {};
    await firebase.getDb().collection('area').doc(request['uid']).set(empty);

    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('discord')
      .set(data);
    return res.status(201).send('Subscribe to discord service');
  }

  async getToken(request: Request) {
    const TokenRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('discord');
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
      .doc('discord')
      .delete();
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('reactions')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().name.includes('discord')) {
            doc.ref.delete();
          }
        });
        return res.status(201).send('Unsubscribe from discord service');
      })
      .catch(() => {
        return res.status(400).send('Error unsubscribing');
      });
  }

  async createDiscordAction(request: Request, id: string, token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc()
      .set({ id: id, token: token, name: 'discord_action' });
  }

  async createDiscordClassicReaction(
    res: Response,
    request: Request,
    id: string,
    actionId: string,
    token: string,
    message: string,
    server: string,
    channel: string,
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
    if (!server || server === undefined) {
      return res.status(400).send('Invalid server');
    }
    if (!channel || channel === undefined) {
      return res.status(400).send('Invalid channel');
    }
    const actionRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions');
    const userNameSnapshot = await actionRef.get();
    userNameSnapshot.forEach(async (doc) => {
      if (doc.data().id == actionId) {
        await firebase
          .getDb()
          .collection('area')
          .doc(request['uid'])
          .collection('actions')
          .doc(doc.data().id)
          .collection('reactions')
          .doc()
          .set({
            id: id,
            token: token,
            name: 'discord_classic_reaction',
            message: message,
            server: server,
            channel: channel,
          });
      }
    });
    return res.status(201).send('Discord reaction created');
  }
}
