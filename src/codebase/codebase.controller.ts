import { Get, Res } from '@nestjs/common';
import { Controller, Request, Post, Delete, Body, Req } from '@nestjs/common';
import { CodebaseService } from './codebase.service';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';

@Controller('/services/codebase')
export class CodebaseController {
  constructor(private readonly codebaseService: CodebaseService) {}

  @ApiOperation({
    summary: 'Subscribe to Codebase',
    description: 'Subscribe to Codebase with his authentification token',
  })
  @Post('subscribe')
  async subscribe(
    @Res() res: Response,
    @Req() request: Request,
    @Body('token') token: string,
    @Body('username') username: string,
  ) {
    return this.codebaseService.subscribe(res, request, token, username);
  }

  @ApiOperation({
    summary: 'Get codebase service token',
    description: 'Get codebase service token',
  })
  @Get('/')
  async getToken(@Req() request: Request) {
    return this.codebaseService.getToken(request);
  }

  @ApiOperation({
    summary: 'Unsubscribe to codebase service',
    description: 'Unsubscribe to codebase service',
  })
  @Delete('/unsubscribe')
  async unsubscribe(@Res() res: Response, @Req() request: Request) {
    return this.codebaseService.unsubscribe(res, request);
  }

  @ApiOperation({
    summary: 'codebase merge request action',
    description:
      'Create codebase merge request action with his id and his token',
  })
  @Post('/action/codebase_merge_request')
  async codebaseMergeRequest(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
  ) {
    return this.codebaseService.codebaseMergeRequest(res, request, id, token);
  }

  @ApiOperation({
    summary: 'codebase push action',
    description: 'Create codebase push action with his id and his token',
  })
  @Post('/action/codebase_push')
  async codebasePush(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
  ) {
    return this.codebaseService.codebasePush(res, request, id, token);
  }

  @ApiOperation({
    summary: 'codebase ticket creation action',
    description:
      'Create codebase ticket creation action with his id and his token',
  })
  @Post('/action/codebase_ticket_creation')
  async codebaseTicketCreation(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
  ) {
    return this.codebaseService.codebaseTicketCreation(res, request, id, token);
  }

  @ApiOperation({
    summary: 'codebase ticket update action',
    description:
      'Create codebase ticket update action with his id and his token',
  })
  @Post('/action/codebase_ticket_update')
  async codebaseTicketUpdate(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
  ) {
    return this.codebaseService.codebaseTicketUpdate(res, request, id, token);
  }

  @ApiOperation({
    summary: 'codebase wiki page hook action',
    description:
      'Create codebase wiki page hook action with his id and his token',
  })
  @Post('/action/codebase_wiki_page_hook')
  async codebaseWikiPageHook(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
  ) {
    return this.codebaseService.codebaseWikiPageHook(res, request, id, token);
  }

  @Post('/reaction')
  async createCodebaseReaction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
  ) {
    return this.codebaseService.createCodebaseReaction(
      request,
      id,
      actionId,
      token,
    );
  }

  @ApiOperation({
    summary: 'Manage codebase trigger',
    description: 'Trigger reaction with codebase action',
  })
  @Post('/webhook')
  async ReactCodebaseWebhook(@Req() request: Request, @Body() payload: any) {
    const username = JSON.parse(payload.payload).reporter.username;
    switch (payload['type']) {
      case 'push': {
        this.codebaseService.initReaction(request, 'codebase_push', username);
        break;
      }
      case 'merge_request_creation': {
        this.codebaseService.initReaction(
          request,
          'codebase_merge_request',
          username,
        );
        break;
      }
      case 'ticket_update': {
        this.codebaseService.initReaction(
          request,
          'codebase_ticket_update',
          username,
        );
        break;
      }
      case 'ticket_creation': {
        this.codebaseService.initReaction(
          request,
          'codebase_ticket_creation',
          username,
        );
        break;
      }
      case 'Wiki Page Hook': {
        this.codebaseService.initReaction(
          request,
          'codebase_wiki_page_hook',
          username,
        );
        break;
      }
    }
  }
}
