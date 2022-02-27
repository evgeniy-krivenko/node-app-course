import { Request, Response, NextFunction, Router } from 'express';
import { UserRegisterDto } from './dto/user-register.dto';

export interface IUserController {
	router: Router;

	register: (req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction) => void;

	login: (req: Request, res: Response, next: NextFunction) => void;
}
