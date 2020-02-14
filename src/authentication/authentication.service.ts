import * as bcrypt from 'bcryptjs';
import {Response} from 'express';
import * as jwt from 'jsonwebtoken';
import UserWithThatEmailAlreayExistsExceptoin from '../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import TokenData from '../interfaces/tokenData.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import CreateUserDto from '../users/user.dto';
import User from '../users/user.interface';
import userModel from '../users/user.model';
import * as speakeasy from 'speakeasy';
import LogInDto from './logIn.dto';
import * as QRCode from 'qrcode';
import RequestWithUser from 'interfaces/requestWithUser.interface';

class AuthenticationService {

    private user = userModel;


    public async Login(loginData: LogInDto){
        const user = await this.user.findOne({email: loginData.email});

        if(user){

            const isPasswordMatching = await bcrypt.compare(loginData.password, user.password);

            if(isPasswordMatching){
                user.password = undefined;
                const tokenData = this.createToken(user);
                const cookie = this.createCookie(tokenData);

                return {
                    cookie, 
                    user,
                };
            } else {
                throw new WrongCredentialsException();
            }
        }
    }

    public async register(userData: CreateUserDto){

        if(await this.user.findOne({email: userData.email}))
            throw new UserWithThatEmailAlreayExistsExceptoin(userData.email);
        
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.user.create({...userData, password:hashedPassword});
        user.password = undefined;

        const tokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);
        
        return {
            cookie, 
            user,
        };
    }

    public getTwoFactorAuthenticationCode() {
        const secretCode = speakeasy.generateSecret({
            name: process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
        });


        console.log("secretCode : " + secretCode.otpauth_url);
        console.log("secretCode : " + secretCode.base32);

        return {
            otpauthUrl: secretCode.otpauth_url, 
            base32: secretCode.base32,
        }
    }

    public responseWithQRCode(data: string, response: Response){
        QRCode.toFileStream(response, data);
    }

    public createToken(user: User): TokenData {
        const expiresIn = 60 * 60;
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: DataStoredInToken = {
            _id: user._id, 
        }

        return {
            expiresIn, 
            token: jwt.sign(dataStoredInToken, secret, {expiresIn}),
        }
    }

    public createCookie(tokenData: TokenData){
        return `Authorization=${tokenData.token}; HttpOnly: Max-Age=${tokenData.expiresIn}`;
    }

    public verifyTwoFactorAuthenticationCode(twoFactorAuthenticationCode: string, user: User){

        return speakeasy.totp.verify({
            secret: user.twoFactorAuthenticationCode, 
            encoding: 'base32', 
            token: twoFactorAuthenticationCode,
        });
    }
}

export default AuthenticationService;
