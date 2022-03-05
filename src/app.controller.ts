import { Controller, Get, Request, Req, Delete, Param, Body } from '@nestjs/common';
import Firebase from 'src/firebase/firebase';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
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
  async getServiceList() {
    var servicelist = "";
    const serviceRef = await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('services');
    const snapshot = await serviceRef.get();
    snapshot.forEach(doc => {
      servicelist+=doc.data().name;
      servicelist+='=';
      servicelist+=doc.data().token;
      servicelist+=';';
    });
    return { servicelist};
  }

@Get('/action_list')
  async getActionList() {
    var actionlists = "";
    const actionRef = Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('actions')
    const snapshot = await actionRef.get();
    snapshot.forEach(doc => {
      actionlists+=doc.data().id;
      actionlists+='=';
      actionlists+=doc.data().token;
      actionlists+=';';
    });
    return { actionlists};
  }

@Get('/reaction_list')
  async getReactionList(@Body("id") id: string) {
    var reactionlists = "";
    console.log(id)
    const reactionRef = Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc(id)
      .collection('reactions')
    const snapshot = await reactionRef.get();
    snapshot.forEach(doc => {
      reactionlists+=doc.data().id;
      reactionlists+='=';
      reactionlists+=doc.data().token;
      reactionlists+=';';
    });
    return { reactionlists};
  }

  @Delete('/profile')
  async removeActionReaction(
    @Request() req,
    @Param('id') id: string,
    @Param('token') token: string,
  ) {
    const docRef = await req
      .firestore()
      .collection('actions')
      .doc(token)
      .collection('reactions')
      .doc(id)
      .delete();
    return 'Action deleted';
  }
}
