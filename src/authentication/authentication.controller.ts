import * as bcrypt from 'bcryptjs';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import TokenData from '../interfaces/tokenData.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../users/user.dto';
import User from '../users/user.interface';
import userModel from '../users/user.model';
import LogInDto from './logIn.dto';
import { IsJWT } from 'class-validator';

class AuthenticationController implements Controller {

    public path = '/auth';
    public router = express.Router();
    private user = userModel;

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.LoggingIn);
        this.router.post(`${this.path}/logout`, this.loggingOut);
    }

    private registration = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const userData: CreateUserDto = req.body;

        if(await this.user.findOne({email: userData.email})){
            next(new UserWithThatEmailAlreadyExistsException(userData.email));
        } else {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await this.user.create({...userData, password: hashedPassword});
            user.password = undefined;

            const tokenData = this.createToken(user);
            res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
            res.send(user);
        }
    }

    private LoggingIn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const logInData: LogInDto = req.body;
        const user = await this.user.findOne({email: logInData.email});

        console.log(user);

        if(user){
            const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
            
            if(isPasswordMatching){
                user.password = undefined;
                const tokenData = this.createToken(user);
                res.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
                res.send(user);
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    }

    private loggingOut = (req: express.Request, res: express.Response) => {
        res.setHeader('Set-Cookie', ['Authorization=;Max-age=0'])
        res.send(200);
    }

    private createCookie(tokenData: TokenData){
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; path=/`;
    }

    private createToken(user: User): TokenData {
        const expiresIn = 60 * 60;
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
            _id: user._id,
        };

        return {
            expiresIn, 
            token: jwt.sign(dataStoredInToken, secret, {expiresIn}),
        }
    }
}

export default AuthenticationController;


