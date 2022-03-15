import { TwitterApi } from 'twitter-api-v2';

export class TwitterReaction {
  private twitterClient: TwitterApi;

  constructor(
    appKey: string,
    appSecret: string,
    accessToken: string,
    accessSecret: string,
  ) {
    this.twitterClient = new TwitterApi({
      appKey: appKey,
      appSecret: appSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });
  }

  async Tweet(message: string) {
    // Tweet
    await this.twitterClient.v2.tweet(message);
  }

  async Follow(targetName: string) {
    // Follow
    const id = (await this.twitterClient.v2.userByUsername(targetName)).data.id;
    const me = (await this.twitterClient.v2.me()).data.id;
    await this.twitterClient.v2.follow(me, id);
  }

  async TwitterReTweet(tweetId: string) {
    // ReTweet
    const me = (await this.twitterClient.v2.me()).data.id;
    await this.twitterClient.v2.retweet(me, tweetId);
  }

  async TwitterLike(tweetId: string) {
    // Like
    const me = (await this.twitterClient.v2.me()).data.id;
    await this.twitterClient.v2.like(me, tweetId);
  }
}
