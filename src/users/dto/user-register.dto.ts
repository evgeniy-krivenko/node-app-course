import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
	@IsEmail({}, { message: 'Введите валидный e-mail' })
	email: string;
	@IsString({ message: 'Передайте пароль' })
	password: string;
	@IsString({ message: 'Передайте имя' })
	name: string;
}
