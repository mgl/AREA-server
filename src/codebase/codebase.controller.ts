import { Get } from '@nestjs/common';
import { Controller, Request, Post, Delete, Body, Req } from '@nestjs/common';
import Firebase from '../firebase/firebase';
import { DiscordController } from '../discord/discord.controller';
import { MailReaction } from '../reactions/MailReaction';

const firebase = new Firebase();
const user = firebase.getAuth().currentUser;

@Controller('/services/codebase')
export class CodebaseController {
  @Post('subscribe')
  async subscribe(@Req() request: Request, @Body('token') token: string) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    const data = {
      token: token,
    };

    await firebase
      .getDb()
      .collection('area')
      .doc(user)
      .collection('services')
      .doc('codebase')
      .set(data);
    return { message: 'Subscribed to codebase service' };
  }

  @Get('/')
  async getToken() {
    const TokenRef = firebase
      .getDb()
      .collection('area')
      .doc(user)
      .collection('services')
      .doc('codebase');
    const doc = await TokenRef.get();
    if (!doc.exists) return { statusCode: '404', message: 'Not found' };
    return { message: '200' + doc.data() };
  }

  @Delete('/unsubscribe')
  async unsubscribe() {
    await firebase
      .getDb()
      .collection('area')
      .doc(user)
      .collection('services')
      .doc('codebase')
      .delete();
    return { message: 'Unsubscribed to codebase service' };
  }

  @Post('/action/codebase_merge_request')
  async codebaseMergeRequest(
    @Req() request: Request,
    @Body('id') id: string,
    @Body() token: string,
  ) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(user)
      .collection('actions')
      .doc()
      .set({ id: id, token: token, name: 'ebase_merge_request' });
  }

  @Post('/action/codebase_push')
  async codebasePush(
    @Req() request: Request,
    @Body('id') id: string,
    @Body() token: string,
  ) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(user)
      .collection('actions')
      .doc()
      .set({ id: id, token: token, name: 'codebase_push' });
  }

  @Post('/action/codebase_ticket_creation')
  async codebaseTicketCreation(
    @Req() request: Request,
    @Body('id') id: string,
    @Body() token: string,
  ) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(user)
      .collection('actions')
      .doc()
      .set({ id: id, token: token, name: 'codebase_ticket_creation' });
  }

  @Post('/action/codebase_ticket_update')
  async codebaseTicketUpdate(
    @Req() request: Request,
    @Body('id') id: string,
    @Body() token: string,
  ) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(user)
      .collection('actions')
      .doc()
      .set({ id: id, token: token, name: 'codebase_ticket_update' });
  }

  @Post('/action/codebase_wiki_page_hook')
  async codebaseWikiPageHook(
    @Req() request: Request,
    @Body('id') id: string,
    @Body() token: string,
  ) {
    if (!token || token === undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(user)
      .collection('actions')
      .doc()
      .set({ id: id, token: token, name: 'codebase_wiki_page_hook' });
  }

  @Post('/reaction')
  async createCodebaseReaction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
  ) {
    if (!id || id == undefined) return { message: '400 Bad Parameter' };
    if (!actionId || actionId == undefined)
      return { message: '400 Bad Parameter' };
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    await firebase
      .getDb()
      .collection('area')
      .doc(user)
      .collection('actions')
      .doc(actionId)
      .collection('reactions')
      .doc()
      .set({ id: id, token: token, name: 'codebase_reaction' });
  }

  @Post('/webhook')
  async ReactCodebaseWebhook(@Req() request: Request, @Body() payload: any) {
    switch (payload['type']) {
      case 'push': {
        const areaRef = firebase.getDb().collection('area');
        const areaSnapshot = await areaRef.get();
        areaSnapshot.forEach(async (user) => {
          const actionRef = firebase
            .getDb()
            .collection('area')
            .doc(user.id)
            .collection('actions');
          const actionSnapshot = await actionRef.get();
          actionSnapshot.forEach(async (doc) => {
            if (doc.data().name == 'codebase_push') {
              const discordController = new DiscordController();
              const mailReaction = new MailReaction();
              const reactionsRef = firebase
                .getDb()
                .collection('area')
                .doc(user.id)
                .collection('actions')
                .doc(doc.id)
                .collection('reactions');
              const reactionsSnapshot = await reactionsRef.get();
              reactionsSnapshot.forEach((reaction) => {
                if (reaction.data().name == 'discord_classic_reaction') {
                  discordController.executeDiscordClassicReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'discord_success_reaction') {
                  console.log(reaction.data().name);
                  discordController.executeDiscordSuccessReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'discord_error_reaction') {
                  discordController.executeDiscordErrorReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'discord_info_reaction') {
                  discordController.executeDiscordInfoReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'discord_warn_reaction') {
                  discordController.executeDiscordWarnReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'mail_action') {
                  mailReaction.send_mail(
                    reaction.data().object,
                    reaction.data().message,
                    reaction.data().receiver,
                  );
                }
              });
            }
          });
        });
        break;
      }
      case 'merge_request_creation': {
        const areaRef = firebase.getDb().collection('area');
        const areaSnapshot = await areaRef.get();
        areaSnapshot.forEach(async (user) => {
          const actionRef = firebase
            .getDb()
            .collection('area')
            .doc(user.id)
            .collection('actions');
          const actionSnapshot = await actionRef.get();
          actionSnapshot.forEach(async (doc) => {
            if (doc.data().name == 'codebase_merge_request') {
              const discordController = new DiscordController();
              const mailReaction = new MailReaction();
              const reactionsRef = firebase
                .getDb()
                .collection('area')
                .doc(user.id)
                .collection('actions')
                .doc(doc.id)
                .collection('reactions');
              const reactionsSnapshot = await reactionsRef.get();
              reactionsSnapshot.forEach((reaction) => {
                if (reaction.data().name == 'discord_classic_reaction') {
                  discordController.executeDiscordClassicReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'discord_success_reaction') {
                  console.log(reaction.data().name);
                  discordController.executeDiscordSuccessReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'discord_error_reaction') {
                  discordController.executeDiscordErrorReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'discord_info_reaction') {
                  discordController.executeDiscordInfoReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'discord_warn_reaction') {
                  discordController.executeDiscordWarnReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'mail_action') {
                  mailReaction.send_mail(
                    reaction.data().object,
                    reaction.data().message,
                    reaction.data().receiver,
                  );
                }
              });
            }
          });
        });
        break;
      }
      case 'ticket_update': {
        const areaRef = firebase.getDb().collection('area');
        const areaSnapshot = await areaRef.get();
        areaSnapshot.forEach(async (user) => {
          const actionRef = firebase
            .getDb()
            .collection('area')
            .doc(user.id)
            .collection('actions');
          const actionSnapshot = await actionRef.get();
          actionSnapshot.forEach(async (doc) => {
            if (doc.data().name == 'codebase_ticket_update') {
              const discordController = new DiscordController();
              const mailReaction = new MailReaction();
              const reactionsRef = firebase
                .getDb()
                .collection('area')
                .doc(user.id)
                .collection('actions')
                .doc(doc.id)
                .collection('reactions');
              const reactionsSnapshot = await reactionsRef.get();
              reactionsSnapshot.forEach((reaction) => {
                if (reaction.data().name == 'discord_classic_reaction') {
                  discordController.executeDiscordClassicReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'discord_success_reaction') {
                  console.log(reaction.data().name);
                  discordController.executeDiscordSuccessReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'discord_error_reaction') {
                  discordController.executeDiscordErrorReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'discord_info_reaction') {
                  discordController.executeDiscordInfoReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'discord_warn_reaction') {
                  discordController.executeDiscordWarnReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'mail_action') {
                  mailReaction.send_mail(
                    reaction.data().object,
                    reaction.data().message,
                    reaction.data().receiver,
                  );
                }
              });
            }
          });
        });
        break;
      }
      case 'Wiki Page Hook': {
        const areaRef = firebase.getDb().collection('area');
        const areaSnapshot = await areaRef.get();
        areaSnapshot.forEach(async (user) => {
          const actionRef = firebase
            .getDb()
            .collection('area')
            .doc(user.id)
            .collection('actions');
          const actionSnapshot = await actionRef.get();
          actionSnapshot.forEach(async (doc) => {
            if (doc.data().name == 'codebase_wiki_page_hook') {
              const discordController = new DiscordController();
              const mailReaction = new MailReaction();
              const reactionsRef = firebase
                .getDb()
                .collection('area')
                .doc(user.id)
                .collection('actions')
                .doc(doc.id)
                .collection('reactions');
              const reactionsSnapshot = await reactionsRef.get();
              reactionsSnapshot.forEach((reaction) => {
                if (reaction.data().name == 'discord_classic_reaction') {
                  discordController.executeDiscordClassicReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'discord_success_reaction') {
                  console.log(reaction.data().name);
                  discordController.executeDiscordSuccessReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'discord_error_reaction') {
                  discordController.executeDiscordErrorReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'discord_info_reaction') {
                  discordController.executeDiscordInfoReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'discord_warn_reaction') {
                  discordController.executeDiscordWarnReaction(
                    request,
                    reaction.data().message,
                  );
                }
                if (reaction.data().name == 'mail_action') {
                  mailReaction.send_mail(
                    reaction.data().object,
                    reaction.data().message,
                    reaction.data().receiver,
                  );
                }
              });
            }
          });
        });
        break;
      }
    }
    console.log(payload['type']);
  }
}
