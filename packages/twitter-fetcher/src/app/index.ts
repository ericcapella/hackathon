import {retrieveUserTweets} from "./twitter-fetcher";
import {
  configKafkaClient,
  consumeMessages,
  KafkaConsumer,
  sendMessage, topicInitialization,
  TweetEvent,
  UserTweetsEvent
} from "@hackathon1021/kafka";


const start = async () => {



  const kafkaClient = configKafkaClient("twitter-fetcher");

  const consumerFunction:KafkaConsumer<UserTweetsEvent> = async (kafka, event) => {
    const tweets: TweetEvent[] = await retrieveUserTweets(event.username, event.last_tweet_id);
    sendMessage(kafka, 'tweet-events', tweets.map(t => ({value: JSON.stringify(t)})));

  }
  await  topicInitialization(kafkaClient,['tweet-events', 'target-users']);
  consumeMessages(kafkaClient,"twitter-fetcher", "target-users",consumerFunction )


}


export default start;