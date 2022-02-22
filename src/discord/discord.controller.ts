import { Controller, Post } from '@nestjs/common';

@Controller('/services/discord')
export class DiscordController {
  @Post('subscribe')
  subscribe() {
    //if (_url === "") {
    //    _url = "https://discordapp.com/api/webhooks/942802858665971832/QlF86Xa2wrzBscnyyRmvC3qYf8D8l2j4Rw-pLbdZbAPZbc7V6B365tyUDDwqVOOIj2G7";
    //}
    return { message: 'Subscribed to Discord service' };
  }
}
