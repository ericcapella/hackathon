import {analyzeSentiment} from "./sentiment";
import {configKafkaClient, consumeMessages, KafkaConsumer, sendMessage, TweetEvent, topicInitialization} from "@hackathon1021/kafka";

const start = async () => {
  console.log('Starting sentiment-analyzer...');

  const kafka = configKafkaClient("sentiment-analyzer");

  const consumer:KafkaConsumer<TweetEvent> = (kafka, event: TweetEvent) => {
    const sentiment = analyzeSentiment(event.text);
    sendMessage(kafka, "analyzed-tweets", [{value:JSON.stringify({...event, sentiment})}]);
  };

  topicInitialization(kafka, ["tweet-events", "analyzed-tweets"]);

  consumeMessages(kafka, "sentiment-analyzer", "tweet-events", consumer);
}

export default start;
