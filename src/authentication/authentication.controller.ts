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
import AuthenticationService from './authentication.service';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import * as speakeasy from 'speakeasy';
import authMiddleware from '../middleware/auth.middleware';

class AuthenticationController implements Controller {

    public path = '/auth';
    public router = express.Router();
    private user = userModel;
    private authenticationService = new AuthenticationService();

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.LoggingIn);
        this.router.post(`${this.path}/logout`, this.loggingOut);
        this.router.post(`${this.path}/2fa/generate`, authMiddleware, this.getTwoFactorAuthenticationCode);
        this.router.post(`${this.path}/2fa/turn-on`, authMiddleware, this.turnOnTwoFactorAuthentication);
    }

    private registration = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const userData: CreateUserDto = req.body;

        try{
            const {cookie, user} = await this.authenticationService.register(userData);
            res.setHeader('Set-Cookie', [cookie]);
            res.send(user);
        } catch(err){
            next(err);
        }
    }

    private LoggingIn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const logInData: LogInDto = req.body;

        try{
            const {cookie, user} = await this.authenticationService.Login(logInData);
            res.setHeader('Set-Cookie', [cookie]);
            res.send(user);
        } catch(err){
            next(err);
        }
    }

    private loggingOut = (req: express.Request, res: express.Response) => {
        res.setHeader('Set-Cookie', ['Authorization=;Max-age=0'])
        res.send(200);
    }


    private getTwoFactorAuthenticationCode = async (
        req: RequestWithUser, 
        res: express.Response        
        ) => {
        const user = req.user;
        const {
            otpauthUrl, 
            base32,
        } = this.authenticationService.getTwoFactorAuthenticationCode();

        await this.user.findByIdAndUpdate(user._id, {twoFactorAuthenticationCode: base32,});
        this.authenticationService.responseWithQRCode(otpauthUrl, res);
    }

    private turnOnTwoFactorAuthentication = async (
        req: RequestWithUser, 
        res: express.Response, 
        next: express.NextFunction
    ) => {
        const {twoFactorAuthenticationCode} = req.body;
        const user = req.user;
        const isCodeValid = await this.authenticationService.verifyTwoFactorAuthenticationCode(twoFactorAuthenticationCode, user);

        if(isCodeValid){
            await this.user.findByIdAndUpdate(user._id, {isTwoFactorAuthenticationEnabled: true})
            res.send(200);
        }
    }


    /* privte secondFactorAuthentication = async (req: RequestWithUser, res: express.Response, next: express.NextFunction) => {
        const {twoFactorAuthenticationCode} = req.body;
        const user = req.user;

        const isCodeValid = await this.authenticationService.verifyTwoFactorAuthenticationCode(twoFactorAuthenticationCode, user);

        if(isCodeValid){
            const tokenData = this.authenticationService.createToken(user);
            
        }
    } */

}

export default AuthenticationController;


