import { Get } from '@nestjs/common';
import {
  Controller,
  Request,
  Post,
  Delete,
  Body,
  Req,
  Headers,
} from '@nestjs/common';
import Firebase from 'src/firebase/firebase';
import { DiscordController } from '../discord/discord.controller';
import { MailReaction } from '../reactions/MailReaction';

const firebase = new Firebase();

async function create_webhook_gitlab(
  repoId: string,
  event: string,
  url: string,
  authToken: string,
) {
  const params = {
    url: url,
    event: true,
  };
  const urlTarget = 'https://gitlab.com/api/v4/projects/' + repoId + '/hooks';
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const XMLHttpRequest = require('xhr2');

  const xhr = new XMLHttpRequest();
  xhr.open('POST', urlTarget);

  xhr.setRequestHeader('PRIVATE-TOKEN', authToken);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
    }
  };

  xhr.send(JSON.stringify(params));
}

@Controller('/services/gitlab')
export class GitlabController {
  @Post('subscribe')
  async subscribe(@Req() request: Request, @Body('token') token: string) {
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    const data = {
      name: 'gitlab',
      token: token,
    };

    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('gitlab')
      .set(data);
    return { message: 'Subscribed to gitlab service' };
  }

  @Get('/')
  async getToken(@Req() request: Request) {
    const TokenRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('gitlab');
    const doc = await TokenRef.get();
    if (!doc.exists) return { statusCode: '404', message: 'Not found' };
    return { message: '200' + doc.data() };
  }

  @Delete('/unsubscribe')
  async unsubscribe(@Req() request: Request) {
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services')
      .doc('gitlab')
      .delete();
    return { message: 'Unsubscribed to gitlab service' };
  }

  @Post('/action/push_events')
  async createGitlabPushEventsAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('repoId') repoId: string,
  ) {
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    let authToken = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const snapshot = await serviceRef.where('name', '==', 'gitlab').get();
    snapshot.forEach((doc) => {
      authToken = doc.data().token;
    });
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(repoId)
      .set({ id: id, token: token, name: 'gitlab_push_events' });

    create_webhook_gitlab(
      repoId,
      'push_events',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/gitlab/webhook',
      authToken,
    );
  }

  @Post('/action/wiki_page_events')
  async createWikiPageEventsAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('repoId') repoId: string,
  ) {
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    let authToken = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const snapshot = await serviceRef.where('name', '==', 'gitlab').get();
    snapshot.forEach((doc) => {
      authToken = doc.data().token;
    });
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(repoId)
      .set({ id: id, token: token, name: 'gitlab_wiki_page_events' });

    create_webhook_gitlab(
      repoId,
      'wiki_page_events',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/gitlab/webhook',
      authToken,
    );
  }

  @Post('/action/note_events')
  async createNoteEventsAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('repoId') repoId: string,
  ) {
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    let authToken = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const snapshot = await serviceRef.where('name', '==', 'gitlab').get();
    snapshot.forEach((doc) => {
      authToken = doc.data().token;
    });
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(repoId)
      .set({ id: id, token: token, name: 'gitlab_note_events' });

    create_webhook_gitlab(
      repoId,
      'note_events',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/gitlab/webhook',
      authToken,
    );
  }

  @Post('/action/merge_requests_events')
  async createMergeRequestsEventsAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('token') token: string,
    @Body('repoId') repoId: string,
  ) {
    if (!token || token == undefined) return { message: '400 Bad Parameter' };
    let authToken = '';
    const serviceRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('services');
    const snapshot = await serviceRef.where('name', '==', 'gitlab').get();
    snapshot.forEach((doc) => {
      authToken = doc.data().token;
    });
    await firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions')
      .doc(repoId)
      .set({ id: id, token: token, name: 'gitlab_merge_requests_events' });

    create_webhook_gitlab(
      repoId,
      'merge_requests_events',
      'https://europe-west1-area-37a17.cloudfunctions.net/api/services/gitlab/webhook',
      authToken,
    );
  }

  @Post('/reaction')
  async createGithubReaction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
  ) {
    if (!id || id == 'undefined') return { message: '400 Bad Parameter' };
    if (!actionId || actionId == 'undefined')
      return { message: '400 Bad Parameter' };
    if (!token || token == 'undefined') return { message: '400 Bad Parameter' };
    const actionRef = firebase
      .getDb()
      .collection('area')
      .doc(request['uid'])
      .collection('actions');
    const userNameSnapshot = await actionRef.get();
    userNameSnapshot.forEach(async (doc) => {
      console.log(doc.data().userName);
      if (doc.data().userName == actionId) {
        await firebase
          .getDb()
          .collection('area')
          .doc(request['uid'])
          .collection('actions')
          .doc(doc.data().repoId)
          .collection('reactions')
          .doc()
          .set({ id: id, token: token, name: 'github_reaction' });
      }
    });
  }

  @Post('/webhook')
  async ReactGitlabWebhook(
    @Headers('x-gitlab-event') header: any,
    @Req() request: Request,
  ) {
    switch (header) {
      case 'Push Hook': {
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
            if (doc.data().name == 'gitlab_push_events') {
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
      case 'pull_request': {
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
            if (doc.data().name == 'gitlab_merge_requests_events') {
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
      case 'Issue Hook': {
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
            if (doc.data().name == 'gitlab_push_events') {
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
      case 'Note Hook': {
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
            if (doc.data().name == 'gitlab_note_events') {
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
            if (doc.data().name == 'gitlab_wiki_page_events') {
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
  }
}
