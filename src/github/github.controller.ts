import { Get, Res } from '@nestjs/common';
import {
  Controller,
  Request,
  Post,
  Delete,
  Body,
  Req,
  Headers,
} from '@nestjs/common';
import { GithubService } from './github.service';
import { Response } from 'express';

@Controller('/services/github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}
  @Post('subscribe')
  async subscribe(
    @Res() res: Response,
    @Req() request: Request,
    @Body('token') token: string,
  ) {
    this.githubService.subscribe(res, request, token);
    return { message: 'Subscribed to github service' };
  }

  @Get('/')
  async getToken(@Req() request: Request) {
    return this.githubService.getToken(request);
  }

  @Delete('/unsubscribe')
  async unsubscribe(@Res() res: Response, @Req() request: Request) {
    return this.githubService.unsubscribe(res, request);
  }

  @Post('/action/push')
  async createGithubPushAction(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('userName') userName: string,
    @Body('repoName') repoName: string,
  ) {
    return this.githubService.createGithubPushAction(
      res,
      request,
      id,
      token,
      userName,
      repoName,
    );
  }

  @Post('/action/pull_request')
  async createGithubPullRequestAction(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('userName') userName: string,
    @Body('repoName') repoName: string,
  ) {
    return this.githubService.createGithubPullRequestAction(
      res,
      request,
      id,
      token,
      userName,
      repoName,
    );
  }

  @Post('/action/issues')
  async createGithubIssuesAction(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('userName') userName: string,
    @Body('repoName') repoName: string,
  ) {
    return this.githubService.createGithubIssuesAction(
      res,
      request,
      id,
      token,
      userName,
      repoName,
    );
  }

  @Post('/action/issue_comment')
  async createGithubIssueCommentAction(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('userName') userName: string,
    @Body('repoName') repoName: string,
  ) {
    return this.githubService.createGithubIssueCommentAction(
      res,
      request,
      id,
      token,
      userName,
      repoName,
    );
  }

  @Post('/action/label')
  async createGithubLabelAction(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('userName') userName: string,
    @Body('repoName') repoName: string,
  ) {
    return this.githubService.createGithubLabelAction(
      res,
      request,
      id,
      token,
      userName,
      repoName,
    );
  }

  @Post('/action/milestone')
  async createGithubMilestoneAction(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('userName') userName: string,
    @Body('repoName') repoName: string,
  ) {
    return this.githubService.createGithubMilestoneAction(
      res,
      request,
      id,
      token,
      userName,
      repoName,
    );
  }

  @Post('/reaction')
  async createGithubReaction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
  ) {
    return this.createGithubReaction(request, id, actionId, token);
  }

  @Post('/webhook')
  async ReactGithubWebhook(
    @Headers('X-GitHub-Event') header: any,
    @Req() request: Request,
    @Body() actionContent: any,
  ) {
    switch (header) {
      case 'push': {
        this.githubService.initReaction(request, actionContent, 'github_push');
        break;
      }
      case 'pull_request': {
        this.githubService.initReaction(
          request,
          actionContent,
          'github_pull_request',
        );
        break;
      }
      case 'issues': {
        this.githubService.initReaction(
          request,
          actionContent,
          'github_issues',
        );
        break;
      }
      case 'issue_comment': {
        this.githubService.initReaction(
          request,
          actionContent,
          'github_issue_comment',
        );
        break;
      }
      case 'label': {
        this.githubService.initReaction(request, actionContent, 'github_label');
        break;
      }
      case 'milestone': {
        this.githubService.initReaction(
          request,
          actionContent,
          'github_milestone',
        );
        break;
      }
    }
  }
}
