import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import UserWithThatEmailAlreayExistsExceptoin from '../exceptions/UserWithThatEmailAlreadyExistsException';
import TokenData from '../interfaces/tokenData.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken';
import CreateUserDto from '../users/user.dto';
import User from '../users/user.interface';
import userModel from '../users/user.model';

class AuthenticationService {

    private user = userModel;

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
}

export default AuthenticationService;
