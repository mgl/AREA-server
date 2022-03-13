import { Client, Intents, TextChannel } from 'discord.js';
import 'dotenv/config';

class DiscordClient {
  private static discordClient: DiscordClient;
  public APIClient: Client;

  private constructor() {
    this.APIClient = new Client({ intents: [Intents.FLAGS.GUILDS] });
    this.APIClient.login(process.env.DISCORD_BOT_TOKEN);
  }

  public static get Instance() {
    if (!this.discordClient) {
      this.discordClient = new DiscordClient();
    }
    return this.discordClient;
  }

  sendMessage(serverName: string, channelName: string, message: string) {
    this.APIClient.guilds.cache.forEach((server) => {
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

export const DiscordClientInstance = DiscordClient.Instance;
