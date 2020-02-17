import HttpExcxeption from './HttpException';

class WrongAuthenticationTokenException extends HttpExcxeption {

    constructor(){
        super(401, 'Wrong authentication token');
    }
}

export default WrongAuthenticationTokenException;
