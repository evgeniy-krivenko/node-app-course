import 'reflect-metadata';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IConfigService } from './config.service.interface';

@injectable()
export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;
	constructor(@inject(TYPES.ILoggerService) private readonly loggerService: ILogger) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.loggerService.error('Не удалось прочитать файл .env');
		} else {
			this.config = result as DotenvParseOutput;
		}
	}
	get<T extends string | number>(key: string): T {
		return this.config[key] as T;
	}
}
