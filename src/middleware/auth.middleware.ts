import {NextFunction, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import DataStoredinToken from '../interfaces/dataStoredInToken';
import RequestWithUser from '../interfaces/requestWithUser.interface'
import userModel from '../users/user.model';
import WrongCredentialsException from 'exceptions/WrongCredentialsException';
import DataStoredInToken from '../interfaces/dataStoredInToken';

async function authMiddleware(req: RequestWithUser, res: Response, next: NextFunction){
    const cookies = req.cookies;

    if(cookies && cookies.Authorization){
        const secret = process.env.JWT_SECRET;

        try{
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
            const id = verificationResponse._id;
            const user = await userModel.findById(id);

            if(user){
                req.user = user;
                next();
            } else {
                next(new WrongCredentialsException());
            }
        } catch(err){
            next(new WrongCredentialsException())
        }
    } else {
        next(new WrongCredentialsException());
    }
}

export default authMiddleware;