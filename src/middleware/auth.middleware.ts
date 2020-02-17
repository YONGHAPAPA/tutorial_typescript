import {NextFunction, Response, RequestHandler} from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import DataStoredinToken from '../interfaces/dataStoredInToken';
import RequestWithUser from '../interfaces/requestWithUser.interface'
import userModel from '../users/user.model';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';

function authMiddleware(omitSecondFactor = false) : RequestHandler {
    return async (req: RequestWithUser, res: Response, next: NextFunction) => {
        const cookies = req.cookies;

        if(cookies && cookies.Authorization){
            const secret = process.env.JWT_SECRET;

            try{
                const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
                const {_id: id, isSecondFactorAuthenticated} = verificationResponse;

                const user = await userModel.findById(id);

                if(user){
                    if(!omitSecondFactor && user.isTwoFactorAuthenticationEnabled && !isSecondFactorAuthenticated){
                        next(new WrongAuthenticationTokenException());
                    } else {
                        req.user = user;
                        next();
                    }
                } else {
                    next(new WrongAuthenticationTokenException());
                }
            } catch(err){
                next(new WrongAuthenticationTokenException())
            }
        } else {
            next(new AuthenticationTokenMissingException());
        }
    }
}


export default authMiddleware;