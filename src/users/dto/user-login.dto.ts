import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Введите валидный e-mail' })
	email: string;
	@IsString({ message: 'Передайте пароль' })
	password: string;
}
