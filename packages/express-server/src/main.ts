import * as express from 'express';
import * as cors from 'cors';
import AppRouter from "./app/routes";
import {connectToDatabase} from "./app/mongo";
const app = express();
app.use(express.json())
app.use(cors());

app.use('/',AppRouter());



const start = async () => {
  console.log('Starting express-server...');

  await connectToDatabase();

  app.listen(3001, () => {
    console.log(`Listening at http://localhost:${3001}`);
  });


  

}



start();


