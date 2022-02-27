import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { User } from './user.entity';
import { IUserService } from './user.service.interface';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IUserRepository } from './user.repository.interface';
import { HttpError } from '../errors/http-error.class';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.IConfigService) private readonly configService: IConfigService,
		@inject(TYPES.IUserRepository) private readonly userRepository: IUserRepository,
	) {}

	async createUser(dto: UserRegisterDto): Promise<User | null> {
		const candidate = new User(dto.email, dto.name);
		const salt = this.configService.get('SALT');
		await candidate.setPassword(dto.password, Number(salt));
		const foundUser = await this.userRepository.find(dto.email);
		if (foundUser) {
			return null;
		}
		return this.userRepository.create(candidate);
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		const foundUser = await this.userRepository.find(dto.email);
		if (!foundUser) {
			return false;
		}
		return foundUser.isValidPassword(dto.password);
	}
}
