import { Client, Intents } from 'discord.js';

export class DiscordReaction {
  public client: any;

  constructor() {
    this.client = new Client({ intents: [Intents.FLAGS.GUILDS] });
    this.client.login(process.env.DISCORD_BOT_TOKEN);
  }

  sendMessage(serverName: string, channelName: string, message: string) {
    this.client.guilds.cache.forEach((server) => {
      if (server.name === serverName) {
        server.channels.cache.forEach((channel) => {
          if (channel.name === channelName) {
            channel.send(message);
          }
        });
      }
    });
  }
}
