import { TwitterApi } from 'twitter-api-v2';

export class TwitterReaction {
  private twitterClient: TwitterApi;

  constructor() {
    this.twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_APP_KEY,
      appSecret: process.env.TWITTER_APP_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });
  }

  async Tweet(message: string) {
    // Tweet
    await this.twitterClient.v2.tweet(message);
  }

  async Follow(userId: string, targetId: string) {
    // Follow
    await this.twitterClient.v2.follow(userId, targetId);
  }

  async TwitterReTweet(userId: string, tweetId: string) {
    // ReTweet
    await this.twitterClient.v2.retweet(userId, tweetId);
  }

  async TwitterLike(userId: string, tweetId: string) {
    // Like
    await this.twitterClient.v2.like(userId, tweetId);
  }
}
