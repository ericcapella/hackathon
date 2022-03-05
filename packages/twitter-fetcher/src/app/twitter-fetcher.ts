import {TweetEvent} from '@hackathon1021/kafka';
import {TwitterApi, TweetV2} from 'twitter-api-v2';


export const retrieveUserTweets = async (username: string, last_tweet_id?: string ) : Promise<TweetEvent[]> =>{
  const token: string = process.env['TWITTER_TOKEN'] as string;
  const twitterClient = new TwitterApi(token);

  const roClient = twitterClient.readOnly;

  const user = await roClient.v2.userByUsername(username, {"user.fields": ["profile_image_url", "url", "name"]});

  if(user.data){
    const tweetTransform = (tweet: TweetV2): TweetEvent => ({
      tweet_id: tweet.id,
      text: tweet.text,
      created_at: tweet.created_at,
      author_id: tweet.author_id,
      user: {
        name: user.data.name,
        username: username,
        image_url: user.data.profile_image_url,
        url: `https://twitter.com/${username}`,
        user_id: user.data.id,
      },
      lang: tweet.lang,
      url: `https://twitter.com/${username}/status/${tweet.id}`
    });
    
    
    let timeline = await roClient.v2.userTimeline(user.data.id, {
      since_id: last_tweet_id as string,
      max_results:100,
      "tweet.fields": ["id", "text", "created_at", "author_id", "lang" ]
    });
    let tweets: TweetEvent[] = timeline.tweets.map(tweetTransform);

    while(!timeline.done){
      timeline = await timeline.next(100);
      tweets = [...tweets, ...timeline.tweets.map(tweetTransform)];
    }
    return tweets;

  }else{
    return [];
  }

}