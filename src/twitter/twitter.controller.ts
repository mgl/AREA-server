import { Get } from '@nestjs/common';
import { Controller, Request, Post, Delete, Body, Req } from '@nestjs/common';
import { TwitterService } from './twitter.service';

@Controller('/services/twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}
  @Post('subscribe')
  async subscribe(
    @Req() request: Request,
    @Body('accessToken') accessToken: string,
    @Body('accessPassword') accessPassword: string,
    @Body('appKeyToken') appKeyToken: string,
    @Body('appPassword') appPassword: string,
  ) {
    return this.twitterService.subscribe(
      request,
      accessToken,
      accessPassword,
      appKeyToken,
      appPassword,
    );
  }

  @Get('/')
  async getToken(@Req() request: Request) {
    return this.twitterService.getToken(request);
  }

  @Delete('/unsubscribe')
  async unsubscribe(@Req() request: Request) {
    return this.twitterService.unsubscribe(request);
  }

  @Post('/action')
  async createTwitterAction(
    @Req() request: Request,
    @Body('id') id: string,
    @Body() token: string,
  ) {
    return this.twitterService.createTwitterAction(request, id, token);
  }

  @Post('/reaction/tweet')
  async createTwitterTweet(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
    @Body('message') message: string,
  ) {
    return this.twitterService.createTwitterTweet(
      request,
      id,
      actionId,
      token,
      message,
    );
  }

  @Post('/reaction/follow')
  async createTwitterFollow(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
    @Body('user') user: string,
  ) {
    return this.twitterService.createTwitterFollow(
      request,
      id,
      actionId,
      token,
      user,
    );
  }

  @Post('/reaction/retweet')
  async createTwitterRetweet(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
    @Body('tweetId') tweetId: string,
  ) {
    return this.twitterService.createTwitterRetweet(
      request,
      id,
      actionId,
      token,
      tweetId,
    );
  }
  @Post('/reaction/like')
  async createTwitterLike(
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
    @Body('tweetId') tweetId: string,
  ) {
    return this.twitterService.createTwitterLike(
      request,
      id,
      actionId,
      token,
      tweetId,
    );
  }
}
