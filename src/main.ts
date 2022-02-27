import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.service.interface';
import { PrismaService } from './database/prisma.service';
import { IExeptionFilter } from './errors/exeption-filter.interface';
import { ExeptionFilter } from './errors/exeption.filter';
import { ILogger } from './logger/logger.interface';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { UserController } from './users/user.controller';
import { IUserController } from './users/user.controller.interface';
import { UserRepository } from './users/user.repository';
import { IUserRepository } from './users/user.repository.interface';
import { UserService } from './users/user.service';
import { IUserService } from './users/user.service.interface';

export interface BootsrapReturnType {
	app: App;
	appContainer: Container;
}

const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IExeptionFilter>(TYPES.ExeptionFilter).to(ExeptionFilter);
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.IUserService).to(UserService);
	bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository).inSingletonScope();
	bind<IConfigService>(TYPES.IConfigService).to(ConfigService).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<ILogger>(TYPES.ILoggerService).to(LoggerService).inSingletonScope();
	bind<App>(TYPES.Application).to(App);
});

function bootstrap(): BootsrapReturnType {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
