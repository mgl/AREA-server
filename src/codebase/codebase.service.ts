import { MailReaction } from '../reactions/MailReaction';
import { Injectable, Request } from '@nestjs/common';
import Firebase from 'src/firebase/firebase';
import { DiscordClientInstance } from '../reactions/DiscordReaction';
import { TwitterReaction } from 'src/reactions/TwitterReaction';

const firebase = new Firebase();

@Injectable()
export class CodebaseService {
  async subscribe(request: Request, token: string, userName: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    const empty = {};
    await firebase.getDb().collection('area').doc(request['uid']).set(empty);

    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('codebase')
      .set({ name: 'Codebase', token: token, userName: userName });
    return { message: 'Subscribed to codebase service' };
  }

  async getToken(request: Request) {
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

  async unsubscribe(request: Request) {
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('codebase')
      .delete();
    return { message: 'Unsubscribed to codebase service' };
  }

  async codebaseMergeRequest(request: Request, id: string, token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(id)
      .set({ id: id, token: token, name: 'codebase_merge_request' });
    return { message: 'Codebase merge request action created' };
  }

  async codebasePush(request: Request, id: string, token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(id)
      .set({ id: id, token: token, name: 'codebase_push' });
    return { message: 'Codebase push action created' };
  }

  async codebaseTicketCreation(request: Request, id: string, token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(id)
      .set({ id: id, token: token, name: 'codebase_ticket_creation' });
    return { message: 'Codebase ticket creation action created' };
  }

  async codebaseTicketUpdate(request: Request, id: string, token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(id)
      .set({ id: id, token: token, name: 'codebase_ticket_update' });
    return { message: 'Codebase ticket update action created' };
  }

  async codebaseWikiPageHook(request: Request, id: string, token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(id)
      .set({ id: id, token: token, name: 'codebase_wiki_page_hook' });
    return { message: 'Codebase wiki page hook action created' };
  }

  async createCodebaseReaction(
    request: Request,
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

  async determineReaction(_request: Request, reactionData: any) {
    const mailReaction = new MailReaction();
    if (reactionData.name == 'discord_classic_reaction') {
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
    if (reactionData.name == 'twitter_tweet') {
      const twitterReaction = new TwitterReaction(
        reactionData.appKeyToken,
        reactionData.appSecret,
        reactionData.accessToken,
        reactionData.accessSecret,
      );
      twitterReaction.Tweet(reactionData.message);
    }

    if (reactionData.name == 'twitter_follow') {
      const twitterReaction = new TwitterReaction(
        reactionData.appKeyToken,
        reactionData.appSecret,
        reactionData.accessToken,
        reactionData.accessSecret,
      );
      twitterReaction.Tweet(reactionData.user);
    }
    if (reactionData.name == 'twitter_retweet') {
      const twitterReaction = new TwitterReaction(
        reactionData.appKeyToken,
        reactionData.appSecret,
        reactionData.accessToken,
        reactionData.accessSecret,
      );
      twitterReaction.Tweet(reactionData.tweetId);
    }
    if (reactionData.name == 'twitter_like') {
      const twitterReaction = new TwitterReaction(
        reactionData.appKeyToken,
        reactionData.appSecret,
        reactionData.accessToken,
        reactionData.accessSecret,
      );
      twitterReaction.Tweet(reactionData.tweetId);
    }
  }

  async initReaction(request: Request, name: string) {
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
