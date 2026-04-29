import { IsNotEmpty, IsOptional } from "class-validator";

export class SocialAuthDto{
    @IsNotEmpty()
    email: string;

    @IsOptional()
    firstName: string;

    @IsOptional()
    lastName: string;

    @IsOptional()
    picture: string;
}