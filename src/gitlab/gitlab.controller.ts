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
import { GitlabService } from './gitlab.service';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';

@Controller('/services/gitlab')
export class GitlabController {
  constructor(private readonly gitlabService: GitlabService) {}
  @ApiOperation({
    summary: 'Subscribe to Gitlab',
    description: 'Subscribe to Gitlab with his authentification token',
  })
  @Post('subscribe')
  async subscribe(
    @Res() res: Response,
    @Req() request: Request,
    @Body('token') token: string,
  ) {
    return this.gitlabService.subscribe(res, request, token);
  }

  @ApiOperation({
    summary: 'Get gitlab service token',
    description: 'Get gitlab service token',
  })
  @Get('/')
  async getToken(@Req() request: Request) {
    return this.gitlabService.getToken(request);
  }

  @ApiOperation({
    summary: 'Unsubscribe to gitlab service',
    description: 'Unsubscribe to gitlab service',
  })
  @Delete('/unsubscribe')
  async unsubscribe(@Res() res: Response, @Req() request: Request) {
    return this.gitlabService.unsubscribe(res, request);
  }

  @ApiOperation({
    summary: 'gitlab push events action',
    description:
      'Create gitlab push  events action with his id and his token and his Gitlab repository Id',
  })
  @Post('/action/push_events')
  async createGitlabPushEventsAction(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('repoId') repoId: string,
  ) {
    return this.gitlabService.createGitlabPushEventsAction(
      res,
      request,
      id,
      token,
      repoId,
    );
  }

  @ApiOperation({
    summary: 'gitlab wiki page events action',
    description:
      'Create gitlab wiki page  events action with his id and his token and his Gitlab repository Id',
  })
  @Post('/action/wiki_page_events')
  async createWikiPageEventsAction(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('repoId') repoId: string,
  ) {
    return this.gitlabService.createWikiPageEventsAction(
      res,
      request,
      id,
      token,
      repoId,
    );
  }

  @ApiOperation({
    summary: 'gitlab wiki note events action',
    description:
      'Create gitlab wiki note  events action with his id and his token and his Gitlab repository Id',
  })
  @Post('/action/note_events')
  async createNoteEventsAction(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('repoId') repoId: string,
  ) {
    return this.gitlabService.createNoteEventsAction(
      res,
      request,
      id,
      token,
      repoId,
    );
  }

  @ApiOperation({
    summary: 'gitlab issue events action',
    description:
      'Create gitlab issue  events action with his id and his token and his Gitlab repository Id',
  })
  @Post('/action/issue')
  async createIssueEventsAction(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('repoId') repoId: string,
  ) {
    return this.gitlabService.createGitlabIssueAction(
      res,
      request,
      id,
      token,
      repoId,
    );
  }

  @ApiOperation({
    summary: 'gitlab merge request events action',
    description:
      'Create gitlab merge request  events action with his id and his token and his Gitlab repository Id',
  })
  @Post('/action/merge_requests_events')
  async createMergeRequestsEventsAction(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('repoId') repoId: string,
  ) {
    return this.gitlabService.createMergeRequestsEventsAction(
      res,
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

  @ApiOperation({
    summary: 'Manage gitlab trigger',
    description: 'Trigger reaction with gitlab action',
  })
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
