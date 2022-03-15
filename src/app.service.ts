import { Injectable } from '@nestjs/common';
import Firebase from 'src/firebase/firebase';

const firebase = new Firebase();

@Injectable()
export class AppService {
  getHello(): string {
    return 'Application Server API';
  }

  async getServiceList(response, request: Request) {
    let servicelist = '';
    const serviceRef = await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const snapshot = await serviceRef.get();
    snapshot.forEach((doc) => {
      servicelist += doc.data().name;
      servicelist += '=';
      servicelist += doc.data().token;
      servicelist += ';';
    });
    if (servicelist == '') return response.status(200).send('No service found');
    else return response.status(200).send(servicelist);
  }

  async getActionList(response, request: Request) {
    let actionlists = '';
    const actionRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions');
    const snapshot = await actionRef.get();
    snapshot.forEach((doc) => {
      actionlists += doc.data().id;
      actionlists += '=';
      actionlists += doc.data().token;
      actionlists += '=';
      actionlists += doc.data().name;
      actionlists += ';';
    });
    if (actionlists == '') return response.status(200).send('No service found');
    return response.status(200).send(actionlists);
  }

  async getReactionList(response, request: Request, id: string) {
    let reactionlists = '';
    console.log(id);
    const reactionRef = firebase
      .getDb()
      .collection('area')
      .doc()
      .collection('actions')
      .doc(id)
      .collection('reactions');
    const snapshot = await reactionRef.get();
    snapshot.forEach((doc) => {
      reactionlists += doc.data().id;
      reactionlists += '=';
      reactionlists += doc.data().token;
      reactionlists += '=';
      reactionlists += doc.data().name;
      reactionlists += ';';
    });
    if (reactionlists == '')
      return response.status(200).send('No service found');
    return response.status(200).send(reactionlists);
  }

  async removeActionReaction(req, id: string, token: string) {
    await req
      .firestore()
      .collection('actions')
      .doc(token)
      .collection('reactions')
      .doc(id)
      .delete();
    return 'Action deleted';
  }
}
