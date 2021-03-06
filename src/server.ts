// import * as express from 'express';
import App from './app';
import PostsController from './posts/posts.controller';
import AuthenticateController from './authentication/authentication.controller';
import * as mongoose from 'mongoose';
import 'dotenv/config';
import validateEnv from './utils/validateEnv';

validateEnv();

//console.log(MONGO_PATH);

/* function loggerMiddleware(req:express.Request, res:express.Response, next){
    console.log(`${req.method} ${req.path}`);
    next();
}

const router = express.Router();


const app = express();

app.use(loggerMiddleware);


router.get('/hello', (req, res) => {
    res.send('hello world');
    //res.send(req.body);
})

app.use('/api', router);

app.listen(5000); */


const app = new App(
    [
        new PostsController(),
        new AuthenticateController(),
    ],    
);
app.listen();
