import TokenData from '../../interfaces/tokenData.interface';
import AuthenticationService from '../authentication.service';
import CreateUserDto from 'users/user.dto';
import UserWithThatEmailAlreadyExistsException from '../../exceptions/UserWithThatEmailAlreadyExistsException';

describe('The AuthenticationService', () => {
    describe('When registering a user', () => {

        describe('if the email is alreay taken', () => {
            it('should throw an error', async() => {
                const userData: CreateUserDto = {
                    name: 'min soo', 
                    email: 'test@hotmail.com', 
                    password: '1234',
                };

                Promise.resolve(userData);

                const authenticationService = new AuthenticationService();
                await expect(authenticationService.register(userData))
                .rejects.toMatchObject(new UserWithThatEmailAlreadyExistsException(userData.email));
            })
        })
    })
})

