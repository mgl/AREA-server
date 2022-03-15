import { Get } from '@nestjs/common';
import { Controller, Request, Post, Delete, Body, Req } from '@nestjs/common';
import { CodebaseService } from './codebase.service';

@Controller('/services/codebase')
export class CodebaseController {
  constructor(private readonly codebaseService: CodebaseService) {}
  @Post('subscribe')
  async subscribe(
    @Req() request: Request,
    @Body('token') token: string,
    userName: string,
  ) {
    return this.codebaseService.subscribe(request, token, userName);
  }

  @Get('/')
  async getToken(@Req() request: Request) {
    return this.codebaseService.getToken(request);
  }

  @Delete('/unsubscribe')
  async unsubscribe(@Req() request: Request) {
    return this.codebaseService.unsubscribe(request);
  }

  @Post('/action/codebase_merge_request')
  async codebaseMergeRequest(
    @Req() request: Request,
    @Body('id') id: string,
    @Body() token: string,
  ) {
    return this.codebaseService.codebaseMergeRequest(request, id, token);
  }

  @Post('/action/codebase_push')
  async codebasePush(
    @Req() request: Request,
    @Body('id') id: string,
    @Body() token: string,
  ) {
    return this.codebaseService.codebasePush(request, id, token);
  }

  @Post('/action/codebase_ticket_creation')
  async codebaseTicketCreation(
    @Req() request: Request,
    @Body('id') id: string,
    @Body() token: string,
  ) {
    return this.codebaseService.codebaseTicketCreation(request, id, token);
  }

  @Post('/action/codebase_ticket_update')
  async codebaseTicketUpdate(
    @Req() request: Request,
    @Body('id') id: string,
    @Body() token: string,
  ) {
    return this.codebaseService.codebaseTicketUpdate(request, id, token);
  }

  @Post('/action/codebase_wiki_page_hook')
  async codebaseWikiPageHook(
    @Req() request: Request,
    @Body('id') id: string,
    @Body() token: string,
  ) {
    return this.codebaseService.codebaseWikiPageHook(request, id, token);
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

  @Post('/webhook')
  async ReactCodebaseWebhook(@Req() request: Request, @Body() payload: any) {
    switch (payload['type']) {
      case 'push': {
        this.codebaseService.initReaction(request, 'codebase_push');
        break;
      }
      case 'merge_request_creation': {
        this.codebaseService.initReaction(request, 'codebase_merge_request');
        break;
      }
      case 'ticket_update': {
        this.codebaseService.initReaction(request, 'codebase_ticket_update');
        break;
      }
      case 'Wiki Page Hook': {
        this.codebaseService.initReaction(request, 'codebase_wiki_page_hook');
        break;
      }
    }
  }
}
