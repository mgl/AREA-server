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
const { Octokit } = require("@octokit/rest");

const { info } = require("firebase-functions/lib/logger");

async function create_webhook_github (owner: string, repo: string, event : string, url : string) {
    const octokit = new Octokit({ auth: `ghp_u1ydXnop4Czyi3J4076cr3LeARxbV11XZEW` });

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
      .doc('uuid')
      .collection('services')
      .doc(request['uid'])
      .set(data);
    return { message: 'Subscribed to github service' };
  }

  @Get('/')
  async getToken(@Req() request: Request) {
    const TokenRef = Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('services')
      .doc(request['uid'])
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
      .doc('uuid')
      .collection('services')
      .doc(request['uid'])
      .delete();
    return { message: 'Unsubscribed to github service' };
  }


  @Post('/action/push')
  async createGithubPushAction(@Body() token: string, @Body() userName: string, @Body() repoName: string) {
    if (!token || token == undefined)
      return { message: '400 Bad Parameter'}
    const data = {
      token: token,
    };
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc()
      .set(data);
    
    create_webhook_github(userName, repoName, "push", "https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook");
  }

  @Post('/action/pull_request')
  async createGithubPullRequestAction(@Body() token: string, @Body() userName: string, @Body() repoName: string) {
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    const data = {
      token: token,
    };
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc()
      .set(data);
    
    create_webhook_github(userName, repoName, "pull_request", "https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook");
  }

  @Post('/action/issues')
  async createGithubIssuesAction(@Body() token: string, @Body() userName: string, @Body() repoName: string) {
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    const data = {
      token: token,
    };
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc()
      .set(data);
    
    create_webhook_github(userName, repoName, "issues", "https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook");
  }

  @Post('/action/issue_comment')
  async createGithubIssueCommentAction(@Body() token: string, @Body() userName: string, @Body() repoName: string) {
    if (!token || token == undefined)
      return { message: '400 Bad Parameter'}
    const data = {
      token: token,
    };
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc()
      .set(data);
    
    create_webhook_github(userName, repoName, "issue_comment", "https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook");
  }

  @Post('/action/label')
  async createGithubLabelAction(@Body() token: string, @Body() userName: string, @Body() repoName: string) {
    if (!token || token == undefined)
      return { message: '400 Bad Parameter'}
    const data = {
      token: token,
    };
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc()
      .set(data);
    
    create_webhook_github(userName, repoName, "label", "https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook");
  }

  @Post('/action/milestone')
  async createGithubMilestoneAction(@Body() token: string, @Body() userName: string, @Body() repoName: string) {
    if (!token || token == undefined)
      return { message: '400 Bad Parameter'}
    const data = {
      token: token,
    };
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc()
      .set(data);
    
    create_webhook_github(userName, repoName, "milestone", "https://europe-west1-area-37a17.cloudfunctions.net/api/services/github/webhook");
  }

@Post('/reaction')
  async createGithubReaction(
    @Body('id') id: Id,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
  ) {
    if (!id || id == undefined)
      return { message: '400 Bad Parameter'}
    if (!actionId || actionId == undefined)
      return { message: '400 Bad Parameter'}
    if (!token || token == undefined)
      return { message: '400 Bad Parameter'}
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc(actionId)
      .collection('reactions')
      .doc()
      .set({id: id, token: token});
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
