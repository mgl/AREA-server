import Firebase from 'src/firebase/firebase';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';

const firebase = new Firebase();

@Injectable()
export class MailService {
  async subscribe(
    res: Response,
    request: Request,
    mail: string,
    password: string,
  ) {
    if (!mail || mail === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!password || password === undefined) {
      return res.status(400).send('Invalid token');
    }
    const empty = {};
    await firebase.getDb().collection('area').doc(request['uid']).set(empty);

    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('mail')
      .set({ name: 'mail', mail: mail, password: password, token: 'token' });
    return res.status(201).send('Subscribe to mail service');
  }

  async getToken(request: Request) {
    const TokenRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('mail');
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
      .doc('mail')
      .delete();
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('reactions')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().name.includes('mail')) {
            doc.ref.delete();
          }
        });
        return res.status(201).send('Unsubscribe from mail service');
      })
      .catch(() => {
        return res.status(400).send('Error unsubscribing');
      });
  }

  async createMailAction(request: Request, id: string, token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc()
      .set({ id: id, token: token, name: 'mail_action' });
    return { message: 'Mail action created' };
  }

  async createMailReaction(
    res: Response,
    request: Request,
    id: string,
    actionId: string,
    object: string,
    token: string,
    content: string,
    receiver: string,
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
    if (!object || object === undefined) {
      return res.status(400).send('Invalid object');
    }
    if (!content || content === undefined) {
      return res.status(400).send('Invalid content');
    }
    if (!receiver || receiver === undefined) {
      return res.status(400).send('Invalid receiver');
    }
    let email = '';
    const actionRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions');
    const userNameSnapshot = await actionRef.get();
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const servicesSnapshot = await serviceRef.get();
    servicesSnapshot.forEach(async (doc) => {
      if (doc.data().name == 'mail') email = doc.data().name;
    });
    userNameSnapshot.forEach(async (doc) => {
      if (doc.data().id == actionId) {
        console.log(doc.data());
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
            name: 'mail_reaction',
            object: object,
            content: content,
            receiver: receiver,
            sender: email,
          });
      }
    });
    return res.status(201).send('Mail reaction created');
  }
}
