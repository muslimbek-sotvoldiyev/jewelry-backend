import { IsString, IsEnum, IsBoolean, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {

  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  @IsOptional() // Parol optional qilinadi
  password?: string;

}