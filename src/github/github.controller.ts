import { Get } from '@nestjs/common';
import {
  Controller,
  Request,
  Post,
  Delete,
  Param,
  Body,
  Req,
  Headers,
} from '@nestjs/common';
import Firebase from '../firebase/firebase';
import {Token, Id, ActionId} from '../error/error';
import { GithubWebhookEvents } from '@dev-thought/nestjs-github-webhooks';
import { DiscordController} from '../discord/discord.controller'
import {DiscordReaction} from '../reactions/DiscordReaction'
const { Octokit } = require("@octokit/rest");

const { info } = require("firebase-functions/lib/logger");

async function create_webhook_github (owner: string, repo: string, event : string, url : string, authToken: string) {
    const octokit = new Octokit({ auth: authToken });

    await octokit.request('POST /repos/{owner}/{repo}/hooks', {
      owner: owner,
      repo: repo,
      events: [
        event
      ],
      config: {
        url: url,
        content_type: "json"
      }
    })
  }

@Controller('/services/github')
export class GithubController {
 @Post('subscribe')
  async subscribe(@Req() request: Request, @Body('token') token: string) {
    if (!token || token == undefined)
      return { message: '400 Bad Parameter'}
    const data = {
      name : 'github',
      token: token,
    };

    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('github')
      .set(data);
    return { message: 'Subscribed to github service' };
  }

  @Get('/')
  async getToken(@Req() request: Request) {
    const TokenRef = Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('github')
    const doc = await TokenRef.get()
    if (!doc.exists)
      return { statusCode: '404', message: 'Not found'}
    return {message: '200' + doc.data()};
  }

  @Delete('/unsubscribe')
  async unsubscribe(@Req() request: Request) {

    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('github')
      .delete();
    return { message: 'Unsubscribed to github service' };
  }


  @Post('/action/push')
  async createGithubPushAction(@Req() request: Request, @Body('id') id: string, @Body('token') token: string, @Body('userName') userName: string, @Body('repoName') repoName: string) {
    if (!token || token == undefined)
      return { message: '400 Bad Parameter'}
    var authToken = '';
    const serviceRef = Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
    const snapshot = await serviceRef.where('name', '==', 'github').get();
    snapshot.forEach(doc => {
      authToken = doc.data().token;
    });
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(userName)
      .set({id: id, token: token, name: "github_push", userName: userName, repoName: repoName});
    
    create_webhook_github(userName, repoName, "push", "https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook", authToken);
  }

  @Post('/action/pull_request')
  async createGithubPullRequestAction(@Req() request: Request, @Body('id') id: string, @Body('token') token: string, @Body('userName') userName: string, @Body('repoName') repoName: string) {
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    var authToken = '';
    const serviceRef = Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
    const snapshot = await serviceRef.where('name', '==', 'github').get();
    snapshot.forEach(doc => {
      authToken = doc.data().token;
    });
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(userName)
      .set({id: id, token: token, name: "github_pull_request", userName: userName, repoName: repoName});
    
    create_webhook_github(userName, repoName, "pull_request", "https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook", authToken);
  }

  @Post('/action/issues')
  async createGithubIssuesAction(@Req() request: Request, @Body('id') id: string, @Body('token') token: string, @Body('userName') userName: string, @Body('repoName') repoName: string) {
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    var authToken = '';
    const serviceRef = Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
    const snapshot = await serviceRef.where('name', '==', 'github').get();
    snapshot.forEach(doc => {
      authToken = doc.data().token;
    });
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(userName)
      .set({id: id, token: token, name: "github_issues", userName: userName, repoName: repoName});
    
    create_webhook_github(userName, repoName, "issues", "https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook", authToken);
  }

  @Post('/action/issue_comment')
  async createGithubIssueCommentAction(@Req() request: Request, @Body('id') id: string, @Body('token') token: string, @Body('userName') userName: string, @Body('repoName') repoName: string) {
    if (!token || token == undefined)
      return { message: '400 Bad Parameter'}
    var authToken = '';
    const serviceRef = Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
    const snapshot = await serviceRef.where('name', '==', 'github').get();
    snapshot.forEach(doc => {
      authToken = doc.data().token;
    });
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(userName)
      .set({id: id, token: token, name: "github_issue_comment", userName: userName, repoName: repoName});
    
    create_webhook_github(userName, repoName, "issue_comment", "https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook", authToken);
  }

  @Post('/action/label')
  async createGithubLabelAction(@Req() request: Request, @Body('id') id: string, @Body('token') token: string, @Body('userName') userName: string, @Body('repoName') repoName: string) {
    if (!token || token == undefined)
      return { message: '400 Bad Parameter'}
    var authToken = '';
    const serviceRef = Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
    const snapshot = await serviceRef.where('name', '==', 'github').get();
    snapshot.forEach(doc => {
      authToken = doc.data().token;    
    });
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(userName)
      .set({id: id, token: token, name: "github_label", userName: userName, repoName: repoName});
    create_webhook_github(userName, repoName, "label", "https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook", authToken);
  }

  @Post('/action/milestone')
  async createGithubMilestoneAction(@Req() request: Request, @Body('id') id: string, @Body('token') token: string, @Body('userName') userName: string, @Body('repoName') repoName: string) {
    if (!token || token == undefined)
      return { message: '400 Bad Parameter'}
    var authToken = '';
    const serviceRef = Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
    const snapshot = await serviceRef.where('name', '==', 'github').get();
    snapshot.forEach(doc => {
      authToken = doc.data().token;
    });
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(userName)
      .set({id: id, token: token, name: "github_milestone", userName: userName, repoName: repoName});
    
    create_webhook_github(userName, repoName, "milestone", "https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook", authToken);
  }

@Post('/reaction')
  async createGithubReaction(
    @Req() request: Request, 
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
  ) {
    if (!id || id == 'undefined')
      return { message: '400 Bad Parameter'}
    if (!actionId || actionId == 'undefined')
      return { message: '400 Bad Parameter'}
    if (!token || token == 'undefined')
      return { message: '400 Bad Parameter'}
    const actionRef = Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
    const userNameSnapshot = await actionRef.get();
    userNameSnapshot.forEach(async doc => {
      if (doc.data().userName == actionId) {
        await Firebase.getInstance()
        .getDb()
        .collection('area')
        .doc(request['uid'])
        .collection('actions')
        .doc(doc.data().userName)
        .collection('reactions')
        .doc()
        .set({id: id, token: token, name: "github_reaction"});
      }    
    });
  }

  @Post('/trigger')
  async triggerActionAndReaction(
    @Req() request: Request, 
    @Body() actionContent : string) {
      var userName = actionContent['repository']['owner']['name'];
      var repoName = actionContent['repository']['name'];
      const actionRef = Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
    const userNameSnapshot = await actionRef.where('userName', '==', userName).get(); 
    userNameSnapshot.forEach(async doc => {   
      if (doc.data().repoName == repoName) {
          var discordController = new DiscordController;
          const reactionsRef = Firebase.getInstance()
          .getDb()
          .collection('area')
          .doc(request['uid'])
          .collection('actions')
          .doc(doc.data().userName)
          .collection('reactions') 
          const reactionsSnapshot = await reactionsRef.get();
          reactionsSnapshot.forEach(reaction => {
          if (reaction.data().name == "discord_classic_reaction") {
             discordController.executeDiscordClassicReaction(request, reaction.data().message);
          }if (reaction.data().name == "discord_success_reaction") {
             discordController.executeDiscordClassicReaction(request, reaction.data().message);
          }if (reaction.data().name == "discord_error_reaction") {
             discordController.executeDiscordClassicReaction(request, reaction.data().message);
          }if (reaction.data().name == "discord_info_reaction") {
             discordController.executeDiscordClassicReaction(request, reaction.data().message);
          }if (reaction.data().name == "discord_warn_reaction") {
             discordController.executeDiscordClassicReaction(request, reaction.data().message);
          }
        });
      }
    });
  }
  
  @GithubWebhookEvents(['push', 'pull_request', 'issues', 'issue_comment', 'label'])
  @Post('/webhook')
  async ReactGithubWebhook(@Headers('X-GitHub-Event') header : any, @Body() payload : any) {
    switch (header) {
      case 'push' : {
        info("New push", {key1 : header});
        break;
      }
      case 'pull_request' : {
        info("New PR", {key1 : header});
        break;
      }
      case 'issues' : {
        info("New issue", {key1 : header});
        break;
      }
      case 'issue_comment' : {
        info("New issue commment", {key1 : header});
        break;
      }
      case 'label' : {
        info("New label 5", {key1 : header});
        break;
      }
      case 'milestone' : {
        info("New milestone", {key1 : header});
        break;
      }
    }
    //console.log(payload);
    //console.log("Something have been push");
    //functions.logger.console.log("Something have been push");
    //info("Something new happend on repo", {key1 : header});
  }
}
