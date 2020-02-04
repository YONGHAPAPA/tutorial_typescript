import * as express from 'express';
import HttpException from '../exceptions/HttpException';

function testMiddle(exception: HttpException, req: express.Request){
    console.log("testMiddle................................................................................");
}

export default testMiddle