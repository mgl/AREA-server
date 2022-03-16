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
import { ApiOperation } from '@nestjs/swagger';

@Controller('/services/github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}
  @ApiOperation({
    summary: 'Subscribe to Github',
    description: 'Subscribe to Github with his authentification token',
  })
  @Post('subscribe')
  async subscribe(
    @Res() res: Response,
    @Req() request: Request,
    @Body('token') token: string,
  ) {
    this.githubService.subscribe(res, request, token);
    return { message: 'Subscribed to github service' };
  }

  @ApiOperation({
    summary: 'Get github service token',
    description: 'Get github service token',
  })
  @Get('/')
  async getToken(@Req() request: Request) {
    return this.githubService.getToken(request);
  }

  @ApiOperation({
    summary: 'Unsubscribe to github service',
    description: 'Unsubscribe to github service',
  })
  @Delete('/unsubscribe')
  async unsubscribe(@Res() res: Response, @Req() request: Request) {
    return this.githubService.unsubscribe(res, request);
  }

  @ApiOperation({
    summary: 'github push action',
    description:
      'Create github push action with his id and his token, his username Github and the name of his Github repository',
  })
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

  @ApiOperation({
    summary: 'github pull request action',
    description:
      'Create github pull request action with his id and his token, his username Github and the name of his Github repository',
  })
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

  @ApiOperation({
    summary: 'github issues action',
    description:
      'Create github issues action with his id and his token, his username Github and the name of his Github repository',
  })
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

  @ApiOperation({
    summary: 'github issue comment action',
    description:
      'Create github issue comment action with his id and his token, his username Github and the name of his Github repository',
  })
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

  @ApiOperation({
    summary: 'github label action',
    description:
      'Create github label action with his id and his token, his username Github and the name of his Github repository',
  })
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

  @ApiOperation({
    summary: 'github milestone action',
    description:
      'Create github milestone action with his id and his token, his username Github and the name of his Github repository',
  })
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

  @ApiOperation({
    summary: 'Manage github trigger',
    description: 'Trigger reaction with github action',
  })
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
