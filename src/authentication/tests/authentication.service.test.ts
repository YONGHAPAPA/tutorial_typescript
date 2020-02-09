import TokenData from '../../interfaces/tokenData.interface';
import AuthenticationService from '../authentication.service';

describe('The AuthenticationService', () => {
    const authenticationService = new AuthenticationService();

    describe('When creating a cookie', () => {
        const tokenData: TokenData = {
            token: '', 
            expiresIn: 1,
        };

        it('should return a string', () => {
            expect(typeof authenticationService.createCookie(tokenData)).toEqual('string');
        })
    })
})

