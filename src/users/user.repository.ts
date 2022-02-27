import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { PrismaService } from '../database/prisma.service';
import { TYPES } from '../types';
import { User } from './user.entity';
import { UserMapper } from './user.mapper';
import { IUserRepository } from './user.repository.interface';

@injectable()
export class UserRepository implements IUserRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: PrismaService) {}

	async create(user: User): Promise<User | null> {
		const { email, name, password } = user;
		const createdUser = await this.prismaService.client.userModel.create({
			data: {
				email,
				name,
				password,
			},
		});
		return UserMapper.mapToDomainEmtity(createdUser);
	}

	async find(email: string): Promise<User | null> {
		const foundUser = await this.prismaService.client.userModel.findFirst({
			where: { email },
		});
		if (!foundUser) {
			return null;
		}
		return UserMapper.mapToDomainEmtity(foundUser);
	}
}
