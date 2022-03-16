import { Get, Res } from '@nestjs/common';
import { Controller, Request, Post, Delete, Body, Req } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { Response } from 'express';
import { ApiOperation } from '@nestjs/swagger';

@Controller('/services/twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}
  @ApiOperation({
    summary: 'Subscribe to Twitter',
    description:
      'Subscribe to Twitter with his access token, his access password, his application token and his application password',
  })
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

  @ApiOperation({
    summary: 'Get twitter service key',
    description: 'Get twitter service key',
  })
  @Get('/')
  async getToken(@Req() request: Request) {
    return this.twitterService.getToken(request);
  }

  @ApiOperation({
    summary: 'Unsubscribe to twitter service',
    description: 'Unsubscribe to twitter service',
  })
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

  @ApiOperation({
    summary: 'Twitter tweet reaction',
    description:
      'Create Twitter tweet reaction with his id, his token, the id of his linked action and the text that will be tweeted',
  })
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

  @ApiOperation({
    summary: 'Twitter follow reaction',
    description:
      'Create Twitter follow reaction with his id, his token, the id of his linked action and the user that will be followed',
  })
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

  @ApiOperation({
    summary: 'Twitter retweet reaction',
    description:
      'Create Twitter retweet reaction with his id, his token, the id of his linked action and the id of the tweet that will be retweeted',
  })
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

  @ApiOperation({
    summary: 'Twitter like reaction',
    description:
      'Create Twitter like reaction with his id, his token, the id of his linked action and the id of the tweet that will be liked',
  })
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
