import { hash, compare } from 'bcrypt';

export class User {
	private _password: string;

	constructor(
		private readonly _email: string,
		private readonly _name: string,
		private readonly _id?: number,
		private readonly _hashedPassword?: string,
	) {}

	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	get password(): string {
		return this._password;
	}

	get id(): number | undefined {
		return this._id;
	}

	public async setPassword(password: string, salt: number): Promise<void> {
		this._password = await hash(password, salt);
	}

	public async isValidPassword(password: string): Promise<boolean> {
		if (!this._hashedPassword) {
			return false;
		}
		const result = await compare(password, this._hashedPassword);
		return result;
	}
}
