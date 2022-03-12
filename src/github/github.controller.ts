import { Get } from '@nestjs/common';
import {
  Controller,
  Request,
  Post,
  Delete,
  Body,
  Req,
  Headers,
} from '@nestjs/common';
import { MailReaction } from '../reactions/MailReaction';
import { Octokit } from '@octokit/rest';
import Firebase from 'src/firebase/firebase';
import { DiscordClientInstance } from '../reactions/DiscordReaction';

const firebase = new Firebase();

async function create_webhook_github(
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

@Controller('/services/github')
export class GithubController {
  @Post('subscribe')
  async subscribe(@Req() request: Request, @Body('token') token: string) {
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    const data = {
      name: 'github',
      token: token,
    };

    await firebase
      .getDb()
      .collection('area')
      .doc()
      .collection('services')
      .doc('github')
      .set(data);
    return { message: 'Subscribed to github service' };
  }

  @Get('/')
  async getToken(@Req() request: Request) {
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

  @Delete('/unsubscribe')
  async unsubscribe(@Req() request: Request) {
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('github')
      .delete();
    return { message: 'Unsubscribed to github service' };
  }

  @Post('/action/push')
  async createGithubPushAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('userName') userName: string,
    @Body('repoName') repoName: string,
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

    create_webhook_github(
      userName,
      repoName,
      'push',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook',
      authToken,
    );
  }

  @Post('/action/pull_request')
  async createGithubPullRequestAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('userName') userName: string,
    @Body('repoName') repoName: string,
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

    create_webhook_github(
      userName,
      repoName,
      'pull_request',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook',
      authToken,
    );
  }

  @Post('/action/issues')
  async createGithubIssuesAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('userName') userName: string,
    @Body('repoName') repoName: string,
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

    create_webhook_github(
      userName,
      repoName,
      'issues',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook',
      authToken,
    );
  }

  @Post('/action/issue_comment')
  async createGithubIssueCommentAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('userName') userName: string,
    @Body('repoName') repoName: string,
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

    create_webhook_github(
      userName,
      repoName,
      'issue_comment',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook',
      authToken,
    );
  }

  @Post('/action/label')
  async createGithubLabelAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('userName') userName: string,
    @Body('repoName') repoName: string,
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
    create_webhook_github(
      userName,
      repoName,
      'label',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook',
      authToken,
    );
  }

  @Post('/action/milestone')
  async createGithubMilestoneAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('userName') userName: string,
    @Body('repoName') repoName: string,
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

    create_webhook_github(
      userName,
      repoName,
      'milestone',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook',
      authToken,
    );
  }

  @Post('/reaction')
  async createGithubReaction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
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

  async determineReaction(request: Request, reactionData: any) {
    const mailReaction = new MailReaction();
    console.log(reactionData);
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

  @Post('/webhook')
  async ReactGithubWebhook(
    @Headers('X-GitHub-Event') header: any,
    @Req() request: Request,
    @Body() actionContent: any,
  ) {
    switch (header) {
      case 'push': {
        this.initReaction(request, actionContent, 'github_push');
        break;
      }
      case 'pull_request': {
        this.initReaction(request, actionContent, 'github_pull_request');
        break;
      }
      case 'issues': {
        this.initReaction(request, actionContent, 'github_issues');
        break;
      }
      case 'issue_comment': {
        this.initReaction(request, actionContent, 'github_issue_comment');
        break;
      }
      case 'label': {
        this.initReaction(request, actionContent, 'github_label');
        break;
      }
      case 'milestone': {
        this.initReaction(request, actionContent, 'github_milestone');
        break;
      }
    }
  }
}
