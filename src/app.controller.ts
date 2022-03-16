import {
  Controller,
  Get,
  Request,
  Req,
  Delete,
  Param,
  Res,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Hello',
    description: 'Hello request with give current email and uid',
  })
  @Get('/hello')
  getUser(@Req() request: Request): string {
    return 'Hello ' + request['email'] + ' with uid ' + request['uid'];
  }

  @ApiOperation({
    summary: 'Get service list',
    description: 'Send a list of the service the user is subscribed to',
  })
  @Get('/service_list')
  async getServiceList(@Res() response, @Req() request: Request) {
    return this.appService.getServiceList(response, request);
  }

  @ApiOperation({
    summary: 'Get action list',
    description: 'Send a list of the action the user has created',
  })
  @Get('/action_list')
  async getActionList(@Res() response, @Req() request: Request) {
    return this.appService.getActionList(response, request);
  }

  @ApiOperation({
    summary: 'Get reaction list',
    description: 'Send a list of the reaction the user has created',
  })
  @Get('/reaction_list')
  async getReactionList(@Res() response, @Req() request: Request) {
    return this.appService.getReactionList(
      response,
      request,
      request.headers['id'],
    );
  }

  @Delete('/profile')
  async removeActionReaction(
    @Request() req,
    @Param('id') id: string,
    @Param('token') token: string,
  ) {
    return this.appService.removeActionReaction(req, id, token);
  }
}
