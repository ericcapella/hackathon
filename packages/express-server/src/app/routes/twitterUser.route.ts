import { Router } from 'express';
import { upsertTwitterUserByUsername } from '../service/twitterUser.service';
import { sendMessage } from '@hackathon1021/kafka';
import { kafka } from '../../main';
const twitterUsersRouter = () => {
  const router = Router();

  router.post('/analyze', async (req, res) => {

    
    const username = req.body.username;

    const user = await upsertTwitterUserByUsername(username, {username});

    sendMessage(kafka, "target-users", [{value: JSON.stringify({username})}])

    //3. enviar target-user con user id

    return res.status(200).json(user);

  });


  return router;
};

export default twitterUsersRouter;
