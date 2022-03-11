import {
  Controller,
  Get,
  Request,
  Req,
  Delete,
  Param,
  Headers,
} from '@nestjs/common';
import Firebase from 'src/firebase/firebase';
import { AppService } from './app.service';
import { DiscordClientInstance } from './reactions/DiscordReaction';

const firebase = new Firebase();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    DiscordClientInstance.sendMessage('YearEndProject', 'bot-test', 'test');
    return this.appService.getHello();
  }

  @Get('/hello')
  getUser(@Req() request: Request): string {
    return 'Hello ' + request['email'] + ' with uid ' + request['uid'];
  }

  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('/service_list')
  async getServiceList(@Req() request: Request) {
    let servicelist = '';
    const serviceRef = await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const snapshot = await serviceRef.get();
    snapshot.forEach((doc) => {
      servicelist += doc.data().name;
      servicelist += '=';
      servicelist += doc.data().token;
      servicelist += ';';
    });
    return { servicelist };
  }

  @Get('/action_list')
  async getActionList(@Req() request: Request) {
    let actionlists = '';
    const actionRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions');
    const snapshot = await actionRef.get();
    snapshot.forEach((doc) => {
      actionlists += doc.data().id;
      actionlists += '=';
      actionlists += doc.data().token;
      actionlists += '=';
      actionlists += doc.data().name;
      actionlists += ';';
    });
    return { actionlists };
  }

  @Get('/reaction_list')
  async getReactionList(@Req() request: Request, @Headers('id') id: string) {
    let reactionlists = '';
    console.log(id);
    const reactionRef = firebase
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc(id)
      .collection('reactions');
    const snapshot = await reactionRef.get();
    snapshot.forEach((doc) => {
      reactionlists += doc.data().id;
      reactionlists += '=';
      reactionlists += doc.data().token;
      reactionlists += '=';
      reactionlists += doc.data().name;
      reactionlists += ';';
    });
    return { reactionlists };
  }

  @Delete('/profile')
  async removeActionReaction(
    @Request() req,
    @Param('id') id: string,
    @Param('token') token: string,
  ) {
    await req
      .firestore()
      .collection('actions')
      .doc(token)
      .collection('reactions')
      .doc(id)
      .delete();
    return 'Action deleted';
  }
}
