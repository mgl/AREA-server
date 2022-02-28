export class DiscordReaction {
  public async Message(message: string, url: string) {
    // Setup
    const webhook = require('webhook-discord');
    const Hook = new webhook.Webhook(url);

    // Send specials messages
    Hook.info('AREA-Info', message);
    Hook.warn('AREA-Warn', message);
    Hook.err('AREA-Err', message);
    Hook.success('AREA-Success', message);

    // Send classic message
    const msg = new webhook.MessageBuilder()
      .setName('AREA-Message')
      .setText(message);

    Hook.send(msg);
  }
}
