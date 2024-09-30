import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  confirmpassword: string;

  @IsString()
  avatar?: string;

  @IsString()
  role?: string;
}


export class logindto{
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  
  @IsNotEmpty()
  @IsString()
  password: string;
  
}