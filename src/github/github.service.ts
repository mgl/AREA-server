import { MailReaction } from '../reactions/MailReaction';
import { Body, Injectable, Request } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { Firebase } from '../firebase/firebase';
import { DiscordClientInstance } from '../reactions/DiscordReaction';
import { TwitterReaction } from '../reactions/TwitterReaction';
import { Response } from 'express';

const firebase = new Firebase();

@Injectable()
export class GithubService {
  async create_webhook_github(
    owner: string,
    repo: string,
    event: string,
    url: string,
    authToken: string,
  ) {
    const octokit = new Octokit({ auth: authToken });
    return octokit.request('POST /repos/{owner}/{repo}/hooks', {
      owner: owner,
      repo: repo,
      events: [event],
      config: {
        url: url,
        content_type: 'json',
      },
    });
  }

  async subscribe(res: Response, request: Request, token: string) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    const data = {
      name: 'github',
      token: token,
    };
    const empty = {};
    await firebase.getDb().collection('area').doc(request['uid']).set(empty);

    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('github')
      .set(data);
    return res.status(201).send('Subscribed to github service');
  }

  async getToken(request: Request) {
    const TokenRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('github');
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
      .doc('github')
      .delete();
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().name.includes('github')) {
            doc.ref.delete();
          }
        });
        return res.status(201).send('Unsubscribe to github service');
      })
      .catch(() => {
        return res.status(400).send('Error unsubscribing');
      });
  }

  async createGithubPushAction(
    res: Response,
    request: Request,
    id: string,
    token: string,
    userName: string,
    repoName: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid id');
    }
    if (!userName || userName === undefined) {
      return res.status(400).send('Invalid username');
    }
    if (!repoName || repoName === undefined) {
      return res.status(400).send('Invalid repository name');
    }
    let authToken = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const snapshot = await serviceRef.where('name', '==', 'github').get();
    snapshot.forEach((doc) => {
      authToken = doc.data().token;
    });

    await this.create_webhook_github(
      userName,
      repoName,
      'push',
      process.env.WEBHOOK_URL + 'services/github/webhook',
      authToken,
    ).catch(() => {
      return res.status(400).send('Error creating webhook');
    });

    firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(id)
      .set({
        id: id,
        token: token,
        name: 'github_push',
        userName: userName,
        repoName: repoName,
      });
    return res.status(201).send('Github push action created');
  }

  async createGithubPullRequestAction(
    res: Response,
    request: Request,
    id: string,
    token: string,
    userName: string,
    repoName: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid id');
    }
    if (!userName || userName === undefined) {
      return res.status(400).send('Invalid username');
    }
    if (!repoName || repoName === undefined) {
      return res.status(400).send('Invalid repository name');
    }
    let authToken = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const snapshot = await serviceRef.where('name', '==', 'github').get();
    snapshot.forEach((doc) => {
      authToken = doc.data().token;
    });

    await this.create_webhook_github(
      userName,
      repoName,
      'pull_request',
      process.env.WEBHOOK_URL + 'services/github/webhook',
      authToken,
    ).catch(() => {
      return res.status(400).send('Error creating webhook');
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
        name: 'github_pull_request',
        userName: userName,
        repoName: repoName,
      });
    return res.status(201).send('Github pull request action created');
  }

  async createGithubIssuesAction(
    res: Response,
    request: Request,
    id: string,
    token: string,
    userName: string,
    repoName: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid id');
    }
    if (!userName || userName === undefined) {
      return res.status(400).send('Invalid username');
    }
    if (!repoName || repoName === undefined) {
      return res.status(400).send('Invalid repository name');
    }
    let authToken = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const snapshot = await serviceRef.where('name', '==', 'github').get();
    snapshot.forEach((doc) => {
      authToken = doc.data().token;
    });

    await this.create_webhook_github(
      userName,
      repoName,
      'issues',
      process.env.WEBHOOK_URL + 'services/github/webhook',
      authToken,
    ).catch(() => {
      return res.status(400).send('Error creating webhook');
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
        name: 'github_issues',
        userName: userName,
        repoName: repoName,
      });
    return res.status(201).send('Github issue action created');
  }

  async createGithubIssueCommentAction(
    res: Response,
    request: Request,
    id: string,
    token: string,
    userName: string,
    repoName: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid id');
    }
    if (!userName || userName === undefined) {
      return res.status(400).send('Invalid username');
    }
    if (!repoName || repoName === undefined) {
      return res.status(400).send('Invalid repository name');
    }
    let authToken = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const snapshot = await serviceRef.where('name', '==', 'github').get();
    snapshot.forEach((doc) => {
      authToken = doc.data().token;
    });

    await this.create_webhook_github(
      userName,
      repoName,
      'issue_comment',
      process.env.WEBHOOK_URL + 'services/github/webhook',
      authToken,
    ).catch(() => {
      return res.status(400).send('Error creating webhook');
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
        name: 'github_issue_comment',
        userName: userName,
        repoName: repoName,
      });
    return res.status(201).send('Github issue comment action created');
  }

  async createGithubLabelAction(
    res: Response,
    request: Request,
    id: string,
    token: string,
    userName: string,
    repoName: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid id');
    }
    if (!userName || userName === undefined) {
      return res.status(400).send('Invalid username');
    }
    if (!repoName || repoName === undefined) {
      return res.status(400).send('Invalid repository name');
    }
    let authToken = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const snapshot = await serviceRef.where('name', '==', 'github').get();
    snapshot.forEach((doc) => {
      authToken = doc.data().token;
    });

    await this.create_webhook_github(
      userName,
      repoName,
      'label',
      process.env.WEBHOOK_URL + 'services/github/webhook',
      authToken,
    ).catch(() => {
      return res.status(400).send('Error creating webhook');
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
        name: 'github_label',
        userName: userName,
        repoName: repoName,
      });
    return res.status(201).send('Github label action created');
  }

  async createGithubMilestoneAction(
    res: Response,
    request: Request,
    id: string,
    token: string,
    userName: string,
    repoName: string,
  ) {
    if (!token || token === undefined) {
      return res.status(400).send('Invalid token');
    }
    if (!id || id === undefined) {
      return res.status(400).send('Invalid id');
    }
    if (!userName || userName === undefined) {
      return res.status(400).send('Invalid username');
    }
    if (!repoName || repoName === undefined) {
      return res.status(400).send('Invalid repository name');
    }
    let authToken = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const snapshot = await serviceRef.where('name', '==', 'github').get();
    snapshot.forEach((doc) => {
      authToken = doc.data().token;
    });

    await this.create_webhook_github(
      userName,
      repoName,
      'milestone',
      process.env.WEBHOOK_URL + 'services/github/webhook',
      authToken,
    ).catch(() => {
      return res.status(400).send('Error creating webhook');
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
        name: 'github_milestone',
        userName: userName,
        repoName: repoName,
      });
    return res.status(201).send('Github milestone action created');
  }

  async createGithubReaction(
    request: Request,
    id: string,
    @Body('actionId') actionId: string,
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
      if (doc.data().userName == actionId) {
        await firebase
          .getDb()
          .collection('area')
          .doc(request['uid'])
          .collection('actions')
          .doc(doc.data().id)
          .collection('reactions')
          .doc()
          .set({ id: id, token: token, name: 'github_reaction' });
      }
    });
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
        reactionData.content,
        reactionData.receiver,
        reactionData.sender,
        reactionData.password,
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

  async initReaction(request: Request, actionContent: any, name: string) {
    const repoName = actionContent['repository']['name'];
    const areaRef = firebase.getDb().collection('area');
    const areaSnapshot = await areaRef.get();
    areaSnapshot.forEach(async (user) => {
      const actionRef = areaRef.doc(user.id).collection('actions');
      const actionSnapshot = await actionRef.get();
      actionSnapshot.forEach(async (doc) => {
        if (doc.data().repoName == repoName) {
          if (doc.data().name == name) {
            const reactionsSnapshot = await actionRef
              .doc(doc.id)
              .collection('reactions')
              .get();
            reactionsSnapshot.forEach((reaction) => {
              this.determineReaction(request, reaction.data());
            });
          }
        }
      });
    });
  }
}
