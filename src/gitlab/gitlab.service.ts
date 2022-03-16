import { MailReaction } from '../reactions/MailReaction';
import { Injectable } from '@nestjs/common';
import Firebase from 'src/firebase/firebase';
import { DiscordClientInstance } from '../reactions/DiscordReaction';
import { TwitterReaction } from 'src/reactions/TwitterReaction';
import { Response } from 'express';
import axios from 'axios';

const firebase = new Firebase();

@Injectable()
export class GitlabService {
  async create_webhook_gitlab(
    repoId: string,
    event: string,
    url: string,
    authToken: string,
  ) {
    const headers = {
      'PRIVATE-TOKEN': authToken,
    };

    const params = {
      url: url,
    };
    params[event] = true;
    if (event !== 'push_events') {
      params['push_events'] = false;
    }

    axios
      .post('https://gitlab.com/api/v4/projects/' + repoId + '/hooks', params, {
        headers: headers,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async subscribe(res: Response, request: Request, token: string) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
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
    return res.status(201).send('Subscribe to gitlab service');
  }

  async getToken(request: Request) {
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

  async unsubscribe(res: Response, request: Request) {
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('gitlab')
      .delete();
    return res.status(201).send('Unsubscribe to gitlab service');
  }

  async createGitlabPushEventsAction(
    res: Response,
    request: Request,
    id: string,
    token: string,
    repoId: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid id');
    }
    if (!repoId || repoId === undefined) {
      return res.status(400).send('Invalid repoId');
    }
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
    return res.status(201).send('Gitlab push event action created');
  }

  async createGitlabIssueAction(
    res: Response,
    request: Request,
    id: string,
    token: string,
    repoId: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid id');
    }
    if (!repoId || repoId === undefined) {
      return res.status(400).send('Invalid repoId');
    }
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
        name: 'gitlab_issues_events',
        repoId: repoId,
      });

    this.create_webhook_gitlab(
      repoId,
      'issues_events',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/gitlab/webhook',
      authToken,
    );
    return res.status(201).send('Gitlab issues event action created');
  }

  async createWikiPageEventsAction(
    res: Response,
    request: Request,
    id: string,
    token: string,
    repoId: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid id');
    }
    if (!repoId || repoId === undefined) {
      return res.status(400).send('Invalid repoId');
    }
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
    return res.status(201).send('Gitlab wiki page event action created');
  }

  async createNoteEventsAction(
    res: Response,
    request: Request,
    id: string,
    token: string,
    repoId: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid id');
    }
    if (!repoId || repoId === undefined) {
      return res.status(400).send('Invalid repoId');
    }
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
    return res.status(201).send('Gitlab note event action created');
  }

  async createMergeRequestsEventsAction(
    res: Response,
    request: Request,
    id: string,
    token: string,
    repoId: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid id');
    }
    if (!repoId || repoId === undefined) {
      return res.status(400).send('Invalid repoId');
    }
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
        name: 'gitlab_merge_requests_events',
        repoId: repoId,
      });

    this.create_webhook_gitlab(
      repoId,
      'merge_requests_events',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/gitlab/webhook',
      authToken,
    );
    return res.status(201).send('Gitlab merge request event action created');
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
        reactionData.content,
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

  async createGitlabReaction(
    request: Request,
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
