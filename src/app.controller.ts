import {
  Controller,
  Get,
  Request,
  Req,
  Delete,
  Param,
  Headers,
  Res,
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

  @Get('/service_list')
  async getServiceList(@Res() response, @Req() request: Request) {
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
    if (servicelist == '') return response.status(210).send('No service found');
    return response.status(200).send(servicelist);
  }

  @Get('/action_list')
  async getActionList(@Res() response, @Req() request: Request) {
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
    if (actionlists == '') return response.status(200).send('No service found');
    return response.status(200).send(actionlists);
  }

  @Get('/reaction_list')
  async getReactionList(
    @Res() response,
    @Req() request: Request,
    @Headers('id') id: string,
  ) {
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
    if (reactionlists == '')
      return response.status(200).send('No service found');
    return response.status(200).send(reactionlists);
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
