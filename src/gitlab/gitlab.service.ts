import { MailReaction } from '../reactions/MailReaction';
import { Injectable } from '@nestjs/common';
import Firebase from 'src/firebase/firebase';
import { DiscordClientInstance } from '../reactions/DiscordReaction';

const firebase = new Firebase();

@Injectable()
export class GitlabService {
  async create_webhook_gitlab(
    repoId: string,
    event: string,
    url: string,
    authToken: string,
  ) {
    const params = {
      url: url,
      event: true,
    };
    const urlTarget = 'https://gitlab.com/api/v4/projects/' + repoId + '/hooks';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const XMLHttpRequest = require('xhr2');

    const xhr = new XMLHttpRequest();
    xhr.open('POST', urlTarget);

    xhr.setRequestHeader('PRIVATE-TOKEN', authToken);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    };

    xhr.send(JSON.stringify(params));
  }

  async subscribe(request: any, token: string) {
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    const data = {
      name: 'gitlab',
      token: token,
    };
    const empty = {};
    await firebase.getDb().collection('area').doc(request['uid']).set(empty);

    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('gitlab')
      .set(data);
    return { message: 'Subscribed to gitlab service' };
  }

  async getToken(request: any) {
    const TokenRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('gitlab');
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
      .doc('gitlab')
      .delete();
    return { message: 'Unsubscribed to gitlab service' };
  }

  async createGitlabPushEventsAction(
    request: any,
    id: string,
    token: string,
    repoId: string,
  ) {
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    let authToken = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const snapshot = await serviceRef.where('name', '==', 'gitlab').get();
    snapshot.forEach((doc) => {
      authToken = doc.data().token;
    });
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(id)
      .set({
        id: id,
        token: token,
        name: 'gitlab_push_events',
        repoId: repoId,
      });

    this.create_webhook_gitlab(
      repoId,
      'push_events',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/gitlab/webhook',
      authToken,
    );
  }

  async createWikiPageEventsAction(
    request: any,
    id: string,
    token: string,
    repoId: string,
  ) {
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    let authToken = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const snapshot = await serviceRef.where('name', '==', 'gitlab').get();
    snapshot.forEach((doc) => {
      authToken = doc.data().token;
    });
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(id)
      .set({
        id: id,
        token: token,
        name: 'gitlab_wiki_page_events',
        repoId: repoId,
      });

    this.create_webhook_gitlab(
      repoId,
      'wiki_page_events',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/gitlab/webhook',
      authToken,
    );
  }

  async createNoteEventsAction(
    request: any,
    id: string,
    token: string,
    repoId: string,
  ) {
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    let authToken = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const snapshot = await serviceRef.where('name', '==', 'gitlab').get();
    snapshot.forEach((doc) => {
      authToken = doc.data().token;
    });
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(id)
      .set({
        id: id,
        token: token,
        name: 'gitlab_note_events',
        repoId: repoId,
      });

    this.create_webhook_gitlab(
      repoId,
      'note_events',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/gitlab/webhook',
      authToken,
    );
  }

  async createMergeRequestsEventsAction(
    request: any,
    id: string,
    token: string,
    repoId: string,
  ) {
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    let authToken = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const snapshot = await serviceRef.where('name', '==', 'gitlab').get();
    snapshot.forEach((doc) => {
      authToken = doc.data().token;
    });
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(repoId)
      .set({
        id: id,
        token: token,
        name: 'gitlab_merge_requests_events',
        repoId: repoId,
      });

    this.create_webhook_gitlab(
      repoId,
      'merge_requests_events',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/gitlab/webhook',
      authToken,
    );
  }

  async determineReaction(request: Request, reactionData: any) {
    const mailReaction = new MailReaction();
    if (reactionData.name == 'discord_classic_reaction') {
      console.log(reactionData.name);
      DiscordClientInstance.sendMessage(
        reactionData.server,
        reactionData.channel,
        reactionData.message,
      );
    }
    if (reactionData.name == 'mail_reaction') {
      mailReaction.send_mail(
        reactionData.object,
        reactionData.message,
        reactionData.receiver,
        reactionData.sender,
      );
    }
  }

  async createGitlabReaction(
    request: any,
    id: string,
    actionId: string,
    token: string,
  ) {
    if (!id || id == 'undefined') return { message: '400 Bad Parameter' };
    if (!actionId || actionId == 'undefined')
      return { message: '400 Bad Parameter' };
    if (!token || token == 'undefined') return { message: '400 Bad Parameter' };
    const actionRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions');
    const userNameSnapshot = await actionRef.get();
    userNameSnapshot.forEach(async (doc) => {
      console.log(doc.data().userName);
      if (doc.data().userName == actionId) {
        await firebase
          .getDb()
          .collection('area')
          .doc(request['uid'])
          .collection('actions')
          .doc(doc.data().repoId)
          .collection('reactions')
          .doc()
          .set({ id: id, token: token, name: 'github_reaction' });
      }
    });
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
            this.determineReaction(request, reaction.data());
          });
        }
      });
    });
  }
}
