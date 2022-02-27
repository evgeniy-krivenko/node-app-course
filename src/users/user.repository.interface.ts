import { User } from './user.entity';

export interface IUserRepository {
	create: (user: User) => Promise<User | null>;
	find: (email: string) => Promise<User | null>;
}
