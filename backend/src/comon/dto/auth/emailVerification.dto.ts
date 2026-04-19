import { IsEmail, IsNotEmpty } from "class-validator";

export class EmailVerificationDto{
    @IsNotEmpty()
    emailCode: number;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}