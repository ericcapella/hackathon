import { Router } from 'express';
import { getAllTweets } from '../service/tweet.service';
const tweetsRouter = () => {
  const router = Router();

  router.get('/', async (req, res) => {

  const tweets = await getAllTweets();

    return res.status(200).json(tweets);
  });

  router.get('/user/:username', async (req, res) => {
    return res.status(200);
  });



  return router;
};

export default tweetsRouter;
