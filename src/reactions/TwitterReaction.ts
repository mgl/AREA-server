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

  public async Tweet(message: string) {
    // Tweet
    this.twitterClient.v2.tweet(message);
  }

  public async Follow(userId: string, targetId: string) {
    // Follow
    this.twitterClient.v2.follow(userId, targetId);
  }

  public async TwitterReTweet(userId: string, tweetId: string) {
    // ReTweet
    this.twitterClient.v2.retweet(userId, tweetId);
  }

  public async TwitterLike(userId: string, tweetId: string) {
    // Like
    this.twitterClient.v2.like(userId, tweetId);
  }
}
