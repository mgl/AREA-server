import Firebase from 'src/firebase/firebase';
import { Injectable } from '@nestjs/common';

const firebase = new Firebase();

@Injectable()
export class MailService {
  async subscribe(request: any, mail: string, password: string) {
    if (!mail || mail === undefined) return { message: '400 Bad Parameter' };

    const empty = {};
    await firebase.getDb().collection('area').doc(request['uid']).set(empty);

    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('mail')
      .set({ name: 'mail', mail: mail, password: password, token: 'token' });
    return { message: 'Subscribed to mail service' };
  }

  async getToken(request: any) {
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

  async unsubscribe(request: any) {
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('mail')
      .delete();
    return { message: 'Unsubscribed to mail service' };
  }

  async createMailAction(request: any, id: string, token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc()
      .set({ id: id, token: token, name: 'mail_action' });
  }

  async createMailReaction(
    request: any,
    id: string,
    actionId: string,
    object: string,
    token: string,
    content: string,
    receiver: string,
  ) {
    if (!id || id == undefined) return { message: '400 Bad Parameter' };
    if (!actionId || actionId == undefined)
      return { message: '400 Bad Parameter' };
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
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
  }
}
