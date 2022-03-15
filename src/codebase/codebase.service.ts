import { MailReaction } from '../reactions/MailReaction';
import { HttpStatus, Injectable, Request } from '@nestjs/common';
import Firebase from 'src/firebase/firebase';
import { DiscordClientInstance } from '../reactions/DiscordReaction';
import { TwitterReaction } from 'src/reactions/TwitterReaction';
import { Response } from 'express';

const firebase = new Firebase();

@Injectable()
export class CodebaseService {
  async subscribe(
    res: Response,
    request: Request,
    token: string,
    userName: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!userName || userName === undefined) {
      return res.status(400).send('Invalid username');
    }
    const empty = {};
    await firebase.getDb().collection('area').doc(request['uid']).set(empty);

    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('codebase')
      .set({ name: 'Codebase', token: token, userName: userName });
    return res.status(201).send('Subscribe to codebase service');
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

  async codebaseMergeRequest(
    res: Response,
    request: Request,
    id: string,
    token: string,
  ) {
    if (!token || token === undefined) {
      return res.status(HttpStatus.BAD_REQUEST).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(HttpStatus.BAD_REQUEST).send('Invalid Id');
    }
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(id)
      .set({ id: id, token: token, name: 'codebase_merge_request' });
    return res.status(201).send('Codebase merge request action created');
  }

  async codebasePush(
    res: Response,
    request: Request,
    id: string,
    token: string,
  ) {
    if (!token || token === undefined) {
      return res.status(HttpStatus.BAD_REQUEST).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid Id');
    }
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(id)
      .set({ id: id, token: token, name: 'codebase_push' });
    return res.status(201).send('Codebase push action created');
  }

  async codebaseTicketCreation(
    res: Response,
    request: Request,
    id: string,
    token: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid Id');
    }
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(id)
      .set({ id: id, token: token, name: 'codebase_ticket_creation' });
    return res.status(201).send('Codebase ticket creation action created');
  }

  async codebaseTicketUpdate(
    res: Response,
    request: Request,
    id: string,
    token: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid Id');
    }
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(id)
      .set({ id: id, token: token, name: 'codebase_ticket_update' });
    return res.status(201).send('Codebase ticket update action created');
  }

  async codebaseWikiPageHook(
    res: Response,
    request: Request,
    id: string,
    token: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid Id');
    }
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(id)
      .set({ id: id, token: token, name: 'codebase_wiki_page_hook' });
    return res
      .status(201)
      .send('Codebase ticket wiki page hook action created');
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
      twitterReaction.Follow(reactionData.user);
    }
    if (reactionData.name == 'twitter_retweet') {
      const twitterReaction = new TwitterReaction(
        reactionData.appKeyToken,
        reactionData.appSecret,
        reactionData.accessToken,
        reactionData.accessSecret,
      );
      twitterReaction.TwitterReTweet(reactionData.tweetId);
    }
    if (reactionData.name == 'twitter_like') {
      const twitterReaction = new TwitterReaction(
        reactionData.appKeyToken,
        reactionData.appSecret,
        reactionData.accessToken,
        reactionData.accessSecret,
      );
      twitterReaction.TwitterLike(reactionData.tweetId);
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
            this.determineReaction(request, reaction.data());
          });
        }
      });
    });
  }
}
