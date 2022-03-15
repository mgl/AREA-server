import { Get, Res } from '@nestjs/common';
import { Controller, Request, Post, Delete, Body, Req } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { Response } from 'express';

@Controller('/services/twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}
  @Post('subscribe')
  async subscribe(
    @Res() res: Response,
    @Req() request: Request,
    @Body('accessToken') accessToken: string,
    @Body('accessPassword') accessPassword: string,
    @Body('appKeyToken') appKeyToken: string,
    @Body('appPassword') appPassword: string,
  ) {
    return this.twitterService.subscribe(
      res,
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
  async unsubscribe(@Res() res: Response, @Req() request: Request) {
    return this.twitterService.unsubscribe(res, request);
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
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
    @Body('message') message: string,
  ) {
    return this.twitterService.createTwitterTweet(
      res,
      request,
      id,
      actionId,
      token,
      message,
    );
  }

  @Post('/reaction/follow')
  async createTwitterFollow(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
    @Body('user') user: string,
  ) {
    return this.twitterService.createTwitterFollow(
      res,
      request,
      id,
      actionId,
      token,
      user,
    );
  }

  @Post('/reaction/retweet')
  async createTwitterRetweet(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
    @Body('tweetId') tweetId: string,
  ) {
    return this.twitterService.createTwitterRetweet(
      res,
      request,
      id,
      actionId,
      token,
      tweetId,
    );
  }
  @Post('/reaction/like')
  async createTwitterLike(
    @Res() res: Response,
    @Req() request: Request,
    @Body('id') id: string,
    @Body('actionId') actionId: string,
    @Body('token') token: string,
    @Body('tweetId') tweetId: string,
  ) {
    return this.twitterService.createTwitterLike(
      res,
      request,
      id,
      actionId,
      token,
      tweetId,
    );
  }
}
