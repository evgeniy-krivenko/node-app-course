import 'reflect-metadata';
import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';
import { BaseController } from '../common/base.controller';
import { HttpError } from '../errors/http-error.class';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IUserController } from './user.controller.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { IUserService } from './user.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';

export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILoggerService) protected readonly logger: ILogger,
		@inject(TYPES.IUserService) protected readonly userService: IUserService,
		@inject(TYPES.IConfigService) protected readonly configService: IConfigService,
	) {
		super(logger);
		this.bindRouters([
			{
				method: 'post',
				path: '/register',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				method: 'post',
				path: '/login',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
		]);
	}

	async register(
		req: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const { body } = req;
		const user = await this.userService.createUser(body);
		if (!user) {
			next(new HttpError(422, 'Such user exists'));
			return;
		}
		this.ok(res, {
			id: user.id,
			email: user.email,
			name: user.name,
		});
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const { body } = req;
		const secret = this.configService.get('JWT_SECRET');
		if (!secret) {
			next(new HttpError(500, 'Отсутствует секретный ключ'));
			return;
		}
		const isValid = await this.userService.validateUser(body);
		if (!isValid) {
			next(new HttpError(401, 'Не удалось авторизироваться'));
			return;
		}
		const jwt = await this.signJWT(body.email, String(secret));
		this.ok(res, {
			jwt,
		});
	}

	private async signJWT(email: string, secret: string): Promise<string> {
		return new Promise((resolve, reject) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
