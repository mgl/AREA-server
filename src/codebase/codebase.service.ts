import { MailReaction } from '../reactions/MailReaction';
import { Injectable } from '@nestjs/common';
import Firebase from 'src/firebase/firebase';
import { DiscordClientInstance } from '../reactions/DiscordReaction';

const firebase = new Firebase();

@Injectable()
export class CodebaseService {
  async subscribe(request: any, token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    const data = {
      token: token,
    };
    const empty = {};
    await firebase.getDb().collection('area').doc(request['uid']).set(empty);

    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('codebase')
      .set(data);
    return { message: 'Subscribed to codebase service' };
  }

  async getToken(request: any) {
    const TokenRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('codebase');
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
      .doc('codebase')
      .delete();
    return { message: 'Unsubscribed to codebase service' };
  }

  async codebaseMergeRequest(request: any, id: string, token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc()
      .set({ id: id, token: token, name: 'ebase_merge_request' });
  }

  async codebasePush(request: any, id: string, token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc()
      .set({ id: id, token: token, name: 'codebase_push' });
  }

  async codebaseTicketCreation(request: any, id: string, token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc()
      .set({ id: id, token: token, name: 'codebase_ticket_creation' });
  }

  async codebaseTicketUpdate(request: any, id: string, token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc()
      .set({ id: id, token: token, name: 'codebase_ticket_update' });
  }

  async codebaseWikiPageHook(request: any, id: string, token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc()
      .set({ id: id, token: token, name: 'codebase_wiki_page_hook' });
  }

  async createCodebaseReaction(
    request: any,
    id: string,
    actionId: string,
    token: string,
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
      .set({ id: id, token: token, name: 'codebase_reaction' });
  }

  async determineReaction(request: any, reactionData: any) {
    const mailReaction = new MailReaction();
    if (reactionData.name == 'discord_classic_reaction') {
      DiscordClientInstance.sendMessage(
        reactionData.server,
        reactionData.channel,
        reactionData.message,
      );
    }
    if (reactionData.name == 'mail_action') {
      mailReaction.send_mail(
        reactionData.object,
        reactionData.message,
        reactionData.receiver,
      );
    }
  }

  async initReaction(request: any, name: string) {
    const areaRef = firebase.getDb().collection('area');
    const areaSnapshot = await areaRef.get();
    areaSnapshot.forEach(async (user) => {
      const actionRef = areaRef.doc(user.id).collection('actions');
      const actionSnapshot = await actionRef.get();
      actionSnapshot.forEach(async (doc) => {
        if (doc.data().name == name) {
          const reactionsSnapshot = await actionRef
            .doc(doc.id)
            .collection('reactions')
            .get();
          reactionsSnapshot.forEach((reaction) => {
            this.determineReaction(request, reaction);
          });
        }
      });
    });
  }
}
