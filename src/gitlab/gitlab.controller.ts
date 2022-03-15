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
import { GitlabService } from './gitlab.service';

@Controller('/services/gitlab')
export class GitlabController {
  constructor(private readonly gitlabService: GitlabService) {}
  @Post('subscribe')
  async subscribe(@Req() request: Request, @Body('token') token: string) {
    return this.gitlabService.subscribe(request, token);
  }

  @Get('/')
  async getToken(@Req() request: Request) {
    return this.gitlabService.getToken(request);
  }

  @Delete('/unsubscribe')
  async unsubscribe(@Req() request: Request) {
    return this.gitlabService.unsubscribe(request);
  }

  @Post('/action/push_events')
  async createGitlabPushEventsAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('repoId') repoId: string,
  ) {
    return this.gitlabService.createGitlabPushEventsAction(
      request,
      id,
      token,
      repoId,
    );
  }

  @Post('/action/wiki_page_events')
  async createWikiPageEventsAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('repoId') repoId: string,
  ) {
    return this.gitlabService.createWikiPageEventsAction(
      request,
      id,
      token,
      repoId,
    );
  }

  @Post('/action/note_events')
  async createNoteEventsAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('repoId') repoId: string,
  ) {
    return this.gitlabService.createNoteEventsAction(
      request,
      id,
      token,
      repoId,
    );
  }

  @Post('/action/issue')
  async createIssueEventsAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('repoId') repoId: string,
  ) {
    return this.gitlabService.createGitlabIssueAction(
      request,
      id,
      token,
      repoId,
    );
  }

  @Post('/action/merge_requests_events')
  async createMergeRequestsEventsAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('repoId') repoId: string,
  ) {
    return this.gitlabService.createMergeRequestsEventsAction(
      request,
      id,
      token,
      repoId,
    );
  }

  @Post('/reaction')
  async createGitlabReaction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
  ) {
    return this.gitlabService.createGitlabReaction(
      request,
      id,
      actionId,
      token,
    );
  }

  @Post('/webhook')
  async ReactGitlabWebhook(
    @Headers('x-gitlab-event') header: any,
    @Req() request: Request,
  ) {
    switch (header) {
      case 'Push Hook': {
        this.gitlabService.initReaction(request, 'gitlab_push_events');
        break;
      }
      case 'pull_request': {
        this.gitlabService.initReaction(
          request,
          'gitlab_merge_requests_events',
        );
        break;
      }
      case 'Issue Hook': {
        this.gitlabService.initReaction(request, 'gitlab_issues_events');
        break;
      }
      case 'Note Hook': {
        this.gitlabService.initReaction(request, 'gitlab_note_events');
        break;
      }
      case 'Wiki Page Hook': {
        this.gitlabService.initReaction(request, 'gitlab_wiki_page_events');
        break;
      }
    }
  }
}
