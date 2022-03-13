import { MailReaction } from '../reactions/MailReaction';
import { Body, Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import Firebase from 'src/firebase/firebase';
import { DiscordClientInstance } from '../reactions/DiscordReaction';

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
    await octokit.request('POST /repos/{owner}/{repo}/hooks', {
      owner: owner,
      repo: repo,
      events: [event],
      config: {
        url: url,
        content_type: 'json',
      },
    });
  }

  async subscribe(request: any, token: string) {
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
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
    return { message: 'Subscribed to github service' };
  }

  async getToken(request: any) {
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
  async unsubscribe(request: any) {
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('github')
      .delete();
    return { message: 'Unsubscribed to github service' };
  }

  async createGithubPushAction(
    request: any,
    id: string,
    token: string,
    userName: string,
    repoName: string,
  ) {
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
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
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(userName)
      .set({
        id: id,
        token: token,
        name: 'github_push',
        userName: userName,
        repoName: repoName,
      });

    this.create_webhook_github(
      userName,
      repoName,
      'push',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook',
      authToken,
    );
  }
  async createGithubPullRequestAction(
    request: any,
    id: string,
    token: string,
    userName: string,
    repoName: string,
  ) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
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
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(userName)
      .set({
        id: id,
        token: token,
        name: 'github_pull_request',
        userName: userName,
        repoName: repoName,
      });

    this.create_webhook_github(
      userName,
      repoName,
      'pull_request',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook',
      authToken,
    );
  }
  async createGithubIssuesAction(
    request: any,
    id: string,
    token: string,
    userName: string,
    repoName: string,
  ) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
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
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(userName)
      .set({
        id: id,
        token: token,
        name: 'github_issues',
        userName: userName,
        repoName: repoName,
      });

    this.create_webhook_github(
      userName,
      repoName,
      'issues',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook',
      authToken,
    );
  }

  async createGithubIssueCommentAction(
    request: any,
    id: string,
    token: string,
    userName: string,
    repoName: string,
  ) {
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
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
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(userName)
      .set({
        id: id,
        token: token,
        name: 'github_issue_comment',
        userName: userName,
        repoName: repoName,
      });

    this.create_webhook_github(
      userName,
      repoName,
      'issue_comment',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook',
      authToken,
    );
  }

  async createGithubLabelAction(
    request: any,
    id: string,
    token: string,
    userName: string,
    repoName: string,
  ) {
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
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
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(userName)
      .set({
        id: id,
        token: token,
        name: 'github_label',
        userName: userName,
        repoName: repoName,
      });
    this.create_webhook_github(
      userName,
      repoName,
      'label',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook',
      authToken,
    );
  }

  async createGithubMilestoneAction(
    request: any,
    id: string,
    token: string,
    userName: string,
    repoName: string,
  ) {
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
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
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(userName)
      .set({
        id: id,
        token: token,
        name: 'github_milestone',
        userName: userName,
        repoName: repoName,
      });

    this.create_webhook_github(
      userName,
      repoName,
      'milestone',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook',
      authToken,
    );
  }

  async createGithubReaction(
    request: any,
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
          .doc(doc.data().userName)
          .collection('reactions')
          .doc()
          .set({ id: id, token: token, name: 'github_reaction' });
      }
    });
  }

  async determineReaction(_request: any, reactionData: any) {
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

  async initReaction(request: any, actionContent: any, name: string) {
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
