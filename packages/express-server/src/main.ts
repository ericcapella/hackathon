import * as express from 'express';
import * as cors from 'cors';
import AppRouter from "./app/routes";
import {connectToDatabase} from "./app/mongo";
import { configKafkaClient, consumeMessages, KafkaConsumer, topicInitialization, TweetSentimentEvent } from '@hackathon1021/kafka';
import { Tweet } from './app/models/tweet.model';
import { createTweet } from './app/service/tweet.service';
const app = express();
app.use(express.json())
app.use(cors());

app.use('/',AppRouter());

export const kafka = configKafkaClient("express-server");


const start = async () => {
  console.log('Starting express-server...');

  await connectToDatabase();



  const consumer:KafkaConsumer<TweetSentimentEvent> = async (kafka, event: TweetSentimentEvent) => {
    await createTweet(event);

  };

  topicInitialization(kafka, ["analyzed-tweets"]);


  consumeMessages(kafka, "express-server", "analyzed-tweets", consumer);

  app.listen(3001, () => {
    console.log(`Listening at http://localhost:${3001}`);
  });



  // const kafka = configKafkaClient("sentiment-analyzer");

  // const consumer:KafkaConsumer<TweetEvent> = (kafka, event: TweetEvent) => {
  //   const sentiment = analyzeSentiment(event.text);
  //   sendMessage(kafka, "analyzed-tweets", [{value:JSON.stringify({...event, sentiment})}]);
  // };

  // topicInitialization(kafka, ["tweet-events", "analyzed-tweets"]);

  // consumeMessages(kafka, "sentiment-analyzer", "tweet-events", consumer);  

}



start();


