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
import { DiscordController} from '../discord/discord.controller'
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
      .doc('uuid')
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
      .doc('uuid')
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
      .doc('uuid')
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
      .doc('uuid')
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
      .doc('uuid')
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
      .doc('uuid')
      .collection('actions')
      .doc()
      .set({id: id, token: token, name: "codebase_ticket_creation"});
  }

  @Post('/action/codebase_ticket_update')
  async codebaseTicketUpdate(@Req() request: Request, @Body('id') id: string, @Body() token: string) {
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc()
      .set({id: id, token: token, name: "codebase_ticket_update"});
  }

  @Post('/action/codebase_wiki_page_hook')
  async codebaseWikiPageHook(@Req() request: Request, @Body('id') id: string, @Body() token: string) {
    if (!token || token === undefined)
      return { message: '400 Bad Parameter'}
    await Firebase.getInstance()
      .getDb()
      .collection('area')
      .doc('uuid')
      .collection('actions')
      .doc()
      .set({id: id, token: token, name: "codebase_wiki_page_hook"});
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
      .doc('uuid')
      .collection('actions')
      .doc(actionId)
      .collection('reactions')
      .doc()
      .set({id: id, token: token, name: "codebase_reaction"});
  }

  @Post('/webhook')
  async ReactCodebaseWebhook(@Req() request: Request, @Body() payload : any) {
    let userName = payload['name']
    switch (payload['type']) {
      case 'push' : {
        const actionRef = Firebase.getInstance()
          .getDb()
          .collection('area')
          .doc('uuid')
          .collection('actions')
        const userNameSnapshot = await actionRef.where('userName', '==', userName).get(); 
        userNameSnapshot.forEach(async doc => {
          if (doc.data().name == "codebase_push") {
              var discordController = new DiscordController;
              const reactionsRef = Firebase.getInstance()
              .getDb()
              .collection('area')
              .doc('uuid')
              .collection('actions')
              .doc(doc.data().userName)
              .collection('reactions') 
              const reactionsSnapshot = await reactionsRef.get();
              reactionsSnapshot.forEach(reaction => {
              if (reaction.data().name == "discord_classic_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_success_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_error_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_info_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_warn_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }
            });
          }
        });
        break;
      }
      case 'merge_request_creation' : {
        const actionRef = Firebase.getInstance()
          .getDb()
          .collection('area')
          .doc('uuid')
          .collection('actions')
        const userNameSnapshot = await actionRef.where('userName', '==', userName).get(); 
        userNameSnapshot.forEach(async doc => {
          if (doc.data().name == "codebase_merge_request") {
              var discordController = new DiscordController;
              const reactionsRef = Firebase.getInstance()
              .getDb()
              .collection('area')
              .doc('uuid')
              .collection('actions')
              .doc(doc.data().userName)
              .collection('reactions') 
              const reactionsSnapshot = await reactionsRef.get();
              reactionsSnapshot.forEach(reaction => {
              if (reaction.data().name == "discord_classic_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_success_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_error_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_info_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_warn_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }
            });
          }
        });
        break;
      }
      case 'ticket_creation' : {
        const actionRef = Firebase.getInstance()
          .getDb()
          .collection('area')
          .doc('uuid')
          .collection('actions')
        const userNameSnapshot = await actionRef.where('userName', '==', userName).get(); 
        userNameSnapshot.forEach(async doc => {
          if (doc.data().name == "codebase_ticket_creation") {
              var discordController = new DiscordController;
              const reactionsRef = Firebase.getInstance()
              .getDb()
              .collection('area')
              .doc('uuid')
              .collection('actions')
              .doc(doc.data().userName)
              .collection('reactions') 
              const reactionsSnapshot = await reactionsRef.get();
              reactionsSnapshot.forEach(reaction => {
              if (reaction.data().name == "discord_classic_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_success_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_error_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_info_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_warn_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }
            });
          }
        });
        break;
      }
      case 'ticket_update' : {
        const actionRef = Firebase.getInstance()
          .getDb()
          .collection('area')
          .doc('uuid')
          .collection('actions')
        const userNameSnapshot = await actionRef.where('userName', '==', userName).get(); 
        userNameSnapshot.forEach(async doc => {
          if (doc.data().name == "codebase_ticket_update") {
              var discordController = new DiscordController;
              const reactionsRef = Firebase.getInstance()
              .getDb()
              .collection('area')
              .doc('uuid')
              .collection('actions')
              .doc(doc.data().userName)
              .collection('reactions') 
              const reactionsSnapshot = await reactionsRef.get();
              reactionsSnapshot.forEach(reaction => {
              if (reaction.data().name == "discord_classic_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_success_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_error_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_info_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_warn_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }
            });
          }
        });
        break;
      }
      case 'Wiki Page Hook' : {
        const actionRef = Firebase.getInstance()
          .getDb()
          .collection('area')
          .doc('uuid')
          .collection('actions')
        const userNameSnapshot = await actionRef.where('userName', '==', userName).get(); 
        userNameSnapshot.forEach(async doc => {
          if (doc.data().name == "codebase_wiki_page_hook") {
              var discordController = new DiscordController;
              const reactionsRef = Firebase.getInstance()
              .getDb()
              .collection('area')
              .doc('uuid')
              .collection('actions')
              .doc(doc.data().userName)
              .collection('reactions') 
              const reactionsSnapshot = await reactionsRef.get();
              reactionsSnapshot.forEach(reaction => {
              if (reaction.data().name == "discord_classic_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_success_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_error_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_info_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }if (reaction.data().name == "discord_warn_reaction") {
                discordController.executeDiscordClassicReaction(request, reaction.data().message);
              }
            });
          }
        });
        break;
      }
    }
    console.log(payload['type']);
  }
}
