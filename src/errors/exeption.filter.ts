import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import { IExeptionFilter } from './exeption-filter.interface';
import { HttpError } from './http-error.class';

@injectable()
export class ExeptionFilter implements IExeptionFilter {
	constructor(@inject(TYPES.ILoggerService) private readonly logger: ILogger) {}

	catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
		let logMessage = err.message;
		let statusCode = 500;

		if (err instanceof HttpError) {
			logMessage = `[${err.context}] Error ${err.statusCode} : ${err.message}`;
			statusCode = err.statusCode;
		}
		this.logger.error(logMessage);
		res.status(statusCode).send({ error: err.message });
	}
}
