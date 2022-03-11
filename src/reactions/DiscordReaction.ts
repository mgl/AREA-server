import { Client, Intents, TextChannel } from 'discord.js';

export class DiscordReaction {
  private client: Client;
  private static instance: DiscordReaction;

  constructor() {
    if (DiscordReaction.instance) {
      return DiscordReaction.instance;
    }
    DiscordReaction.instance = this;

    this.client = new Client({ intents: [Intents.FLAGS.GUILDS] });
    console.log(process.env.DISCORD_BOT_TOKEN);
    this.client.login(process.env.DISCORD_BOT_TOKEN);
  }
  sendMessage(serverName: string, channelName: string, message: string) {
    this.client.guilds.cache.forEach((server) => {
      if (server.name === serverName) {
        server.channels.cache.forEach((channel) => {
          if (channel.name === channelName) {
            (channel as TextChannel).send(message);
          }
        });
      }
    });
  }
}
