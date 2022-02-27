import 'reflect-metadata';
import express, { Express } from 'express';
import { json } from 'body-parser';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { IExeptionFilter } from './errors/exeption-filter.interface';
import { IUserController } from './users/user.controller.interface';
import { ILogger } from './logger/logger.interface';
import { PrismaService } from './database/prisma.service';

@injectable()
export class App {
	app: Express;
	port: number | string;
	server: Server;

	constructor(
		@inject(TYPES.ILoggerService) private readonly logger: ILogger,
		@inject(TYPES.UserController) private readonly userController: IUserController,
		@inject(TYPES.ExeptionFilter) private readonly exeprionFilter: IExeptionFilter,
		@inject(TYPES.PrismaService) private readonly prismaService: PrismaService,
	) {
		this.app = express();
		this.port = process.env.PORT || 8000;
	}

	private useMiiddleware(): void {
		this.app.use(json());
	}

	/**
	 * Роуты пользователей
	 */
	private useRoutes(): void {
		this.app.use('/users', this.userController.router);
	}

	private useExeptionFilters(): void {
		this.app.use(this.exeprionFilter.catch.bind(this.exeprionFilter));
	}

	public async init(): Promise<void> {
		this.useMiiddleware();
		await this.prismaService.connect();
		this.useRoutes();
		this.useExeptionFilters();
		this.server = this.app.listen(this.port);
		this.logger.log(`Server starting on http://localhost:${this.port}`);
	}
}
