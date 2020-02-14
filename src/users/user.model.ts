import * as mongoose from 'mongoose';
import User from './user.interface';

const addressSchema = new mongoose.Schema({
    city: String,
    country: String, 
    street: String,
});

const userSchema = new mongoose.Schema({
    name: String, 
    email: String, 
    password: String,
    address: addressSchema,
    twoFactorAuthenticationCode: String,
    isTwoFactorAuthenticationEnabled: Boolean,
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;

/* 
{
	"name":"kimminsoo",
	"email":"test@hotmail.com",
	"password":"test",
	"address":{
		"city":"pusan", 
		"country":"korea", 
		"street":"sanbonchunro"
	}, 
	"twoFactorAuthenticationCode": "", 
	"isTwoFactorAuthenticationEnabled": false
}
 */