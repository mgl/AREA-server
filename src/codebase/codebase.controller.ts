import { Get } from '@nestjs/common';
import {
  Controller,
  Request,
  Post,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import Firebase from '../firebase/firebase';
import {Token, Id, ActionId} from '../error/error';

const { info } = require("firebase-functions/lib/logger");

@Controller('/services/codebase')
export class CodebaseController {
  @Post('subscribe')
  async subscribe(@Req() request: Request, @Body('token') token: string) {
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    const data = {
      codebase_token: token,
    };

    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('codebase')
      .set(data);
    return { message: 'Subscribed to codebase service' };
  }

  @Get('/')
  async getToken(@Req() request: Request) {
    const TokenRef = Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('codebase')
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
      .doc('codebase')
      .delete();
    return { message: 'Unsubscribed to codebase service' };
  }

  @Post('/action/codebase_merge_request')
  async codebaseMergeRequest(@Req() request: Request, @Body('id') id: string, @Body() token: string) {
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc()
      .set({id: id, token: token, name: "codebase_merge_request"});
  }

  @Post('/action/codebase_push')
  async codebasePush(@Req() request: Request, @Body('id') id: string, @Body() token: string) {
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc()
      .set({id: id, token: token, name: "codebase_push"});
  }

@Post('/action/codebase_ticket_creation')
  async codebaseTicketCreation(@Req() request: Request, @Body('id') id: string, @Body() token: string) {
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc()
      .set({id: id, token: token, name: "codebase_ticket_creationn"});
  }

  @Post('/action/codebase_ticket_update')
  async codebaseTicketUpdate(@Req() request: Request, @Body('id') id: string, @Body() token: string) {
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc()
      .set({id: id, token: token, name: "codebase_ticket_update"});
  }

  @Post('/reaction')
  async createCodebaseReaction(
    @Req() request: Request,
    @Body('id') id: string,
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
      .doc(request['uid'])
      .collection('actions')
      .doc(actionId)
      .collection('reactions')
      .doc()
      .set({id: id, token: token, name: "codebase_reaction"});
  }

  @Post('/webhook')
  async ReactCodebaseWebhook(@Body() payload : any) {
    switch (payload['type']) {
      case 'push' : {
        info("New push", {key1 : payload['type']});
        break;
      }
      case 'merge_request_creation' : {
        info("New PR", {key1 : payload['type']});
        break;
      }
      case 'ticket_creation' : {
        info("New ticket", {key1 : payload['type']});
        break;
      }
      case 'ticket_update' : {
        info("Ticket updated", {key1 : payload['type']});
        break;
      }
      case 'Wiki Page Hook' : {
        info("Wiki page edited", {key1 : payload['type']});
        break;
      }
    }
    console.log(payload['type']);
  }
}
