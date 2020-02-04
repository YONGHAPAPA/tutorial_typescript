import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose'
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';

import testMiddle from './middleware/testMiddle';

class App {
    public app: express.Application;

    constructor(controllers: Controller[]){
        this.app = express();

        this.connecToTheDatabase();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);

        //this.testMiddle();
        this.initializeErrorHandling();
    }

    private initializeMiddlewares(){
        this.app.use(bodyParser.json());
    }

    private initializeControllers(controllers){
        controllers.forEach((controller) => {
             this.app.use('/', controller.router);
        })
    }

    private initializeErrorHandling(){
        this.app.use(errorMiddleware);
    }

    private testMiddle(){
        this.app.use(testMiddle);
    }

    private connecToTheDatabase(){
        const {
            MONGO_USER, 
            MONGO_PASSWORD, 
            MONGO_PATH,
        } = process.env;

        mongoose.connect(process.env.MONGO_PATH);
    }

    public listen(){
        this.app.listen(process.env.PORT, ()=>{
            console.log(`App listening on the port ${process.env.PORT}`);
        });
    }
}

export default App;
