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
import { GithubService } from './github.service';

@Controller('/services/github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}
  @Post('subscribe')
  async subscribe(@Req() request: Request, @Body('token') token: string) {
    this.githubService.subscribe(request, token);
    return { message: 'Subscribed to github service' };
  }

  @Get('/')
  async getToken(@Req() request: Request) {
    this.githubService.getToken(request);
  }

  @Delete('/unsubscribe')
  async unsubscribe(@Req() request: Request) {
    this.githubService.unsubscribe(request);
  }

  @Post('/action/push')
  async createGithubPushAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('userName') userName: string,
    @Body('repoName') repoName: string,
  ) {
    this.githubService.createGithubPushAction(
      request,
      id,
      token,
      userName,
      repoName,
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
    this.githubService.createGithubPullRequestAction(
      request,
      id,
      token,
      userName,
      repoName,
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
    this.githubService.createGithubIssuesAction(
      request,
      id,
      token,
      userName,
      repoName,
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
    this.githubService.createGithubIssueCommentAction(
      request,
      id,
      token,
      userName,
      repoName,
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
    this.githubService.createGithubLabelAction(
      request,
      id,
      token,
      userName,
      repoName,
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
    this.githubService.createGithubIssuesAction(
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
    this.createGithubReaction(request, id, actionId, token);
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
