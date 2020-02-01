// import * as express from 'express';
import App from './app';
import PostController from './posts/posts.controller';



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
        new PostController(),
    ], 
    5000,
);
app.listen();
console.log("server listening.......");