import { UserModel } from '@prisma/client';
import { User } from './user.entity';

export class UserMapper {
	static mapToDomainEmtity(userModel: UserModel): User {
		return new User(userModel.email, userModel.name, userModel.id);
	}
}
