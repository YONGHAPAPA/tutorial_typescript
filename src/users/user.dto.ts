
import { IsOptional, IsString, ValidateNested, IsBoolean } from 'class-validator';
import CreateAddressDto from './address.dto';

class CreateUserDto {
    @IsString()
    public name: string;

    @IsString()
    public email: string;

    @IsString()
    public password: string;

    @IsString()
    public twoFactorAuthenticationCode: string;

    @IsBoolean()
    public isTwoFactorAuthenticationEnabled: boolean;

    @IsOptional()
    @ValidateNested()
    public address?: CreateAddressDto;
}

export default CreateUserDto;
