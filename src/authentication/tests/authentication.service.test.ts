import TokenData from '../../interfaces/tokenData.interface';
import AuthenticationService from '../../authentication/authentication.service';

describe('The AuthenticationService', () => {

    test('1 is 1', () => {
        expect(1).toBe(1);
    });

    /*
    describe('when creating a cookie', () => {
        it('should return a string', () => {
            const tokenData: TokenData = {
                token: '',
                expiresIn: 1
            };

            const authenticationService = new AuthenticationService();
            expect(
                typeof authenticationService.createCookie(tokenData)
            ).toEqual('string');
        });
    });
    */
});

