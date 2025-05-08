import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";

export class RegisterUserDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  country!: string;
}

export class LoginUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}

export class VerifyEmailDto {
  @IsString()
  token!: string;
}

export class CreateMessageDto {
  @IsString()
  content!: string;

  @IsString()
  messageType!: "direct" | "group";

  @IsString()
  @IsOptional()
  recipientId?: string;

  @IsString()
  @IsOptional()
  groupId?: string;
}

export class CreateGroupDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;
}
