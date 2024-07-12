import { IsNumber, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  role_id: number;
}
