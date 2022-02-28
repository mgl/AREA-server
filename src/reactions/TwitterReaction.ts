import { TwitterApi } from 'twitter-api-v2';

export class TwitterReaction {
  public async Tweet(
    message: string,
    appKey: string,
    appSecret: string,
    accessToken: string,
    accessSecret: string,
  ) {
    // Setup
    const client = new TwitterApi({
      appKey: appKey,
      appSecret: appSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    // Tweet
    client.v2
      .tweet(message)
      .then((val) => {
        console.log(val);
        console.log('success');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public async Follow(
    userId: string,
    targetId: string,
    appKey: string,
    appSecret: string,
    accessToken: string,
    accessSecret: string,
  ) {
    // Setup
    const client = new TwitterApi({
      appKey: appKey,
      appSecret: appSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    // Follow
    client.v2
      .follow(userId, targetId)
      .then((val) => {
        console.log(val);
        console.log('success');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public async TwitterReTweet(
    userId: string,
    tweetId: string,
    appKey: string,
    appSecret: string,
    accessToken: string,
    accessSecret: string,
  ) {
    // Setup
    const client = new TwitterApi({
      appKey: appKey,
      appSecret: appSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    // ReTweet
    client.v2.retweet(userId, tweetId);
  }

  public async TwitterLike(
    userId: string,
    tweetId: string,
    appKey: string,
    appSecret: string,
    accessToken: string,
    accessSecret: string,
  ) {
    // Setup
    const client = new TwitterApi({
      appKey: appKey,
      appSecret: appSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    // Like
    client.v2.like(userId, tweetId);
  }
}
