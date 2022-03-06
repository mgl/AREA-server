export class DiscordReaction {
  public async classicMessage(message: string, url: string) {
    // Setup
    const webhook = require('webhook-discord');
    const Hook = new webhook.Webhook(url);

    const msg = new webhook.MessageBuilder()
      .setName('AREA-Message')
      .setText(message);

    Hook.send(msg);
  }

public async successMessage(message: string, url: string) {
    // Setup
    const webhook = require('webhook-discord');
    const Hook = new webhook.Webhook(url);

    Hook.success('AREA-Success', message);
  }

  public async errorMessage(message: string, url: string) {
    // Setup
    const webhook = require('webhook-discord');
    const Hook = new webhook.Webhook(url);

    Hook.err('AREA-Err', message);
  }

  public async infoMessage(message: string, url: string) {
    // Setup
    const webhook = require('webhook-discord');
    const Hook = new webhook.Webhook(url);

    Hook.info('AREA-Info', message);

  }

  public async warnMessage(message: string, url: string) {
    // Setup
    const webhook = require('webhook-discord');
    const Hook = new webhook.Webhook(url);

    Hook.warn('AREA-Warn', message);

  }
}
