import {IsString} from 'class-validator';

class CreatePostDto {
    @IsString()
    public authorId: string;

    @IsString()
    public content: string;

    @IsString()
    public title: string;
}

export default CreatePostDto;