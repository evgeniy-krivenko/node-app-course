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
import { User } from './user.entity';
import { IUserService } from './user.service.interface';
import { ValidateMiddleware } from '../common/validate.middleware';

export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILoggerService) protected readonly logger: ILogger,
		@inject(TYPES.IUserService) protected readonly userService: IUserService,
	) {
		super(logger);
		this.bindRouters([
			{
				method: 'post',
				path: '/register',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{ method: 'post', path: '/login', func: this.login },
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

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		// this.ok(res, 'Вход выполнен');
		console.log(req.body);
		next(new HttpError(401, 'Не удалось авторизироваться'));
	}
}
