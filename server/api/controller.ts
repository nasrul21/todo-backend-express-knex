import { Request, Response } from 'express';
import { AuthTokenDetail, AuthTokenSign } from './auth/authModel';

export default class Controller {
    protected addErrorReporting(func: Function, message: string) {
        return async function (req: Request, res: Response) {
            try {
                return await func(req, res);
            } catch (err) {
                console.log(`${message} caused by: ${err}`);

                // Not always 500, but for simplicity's sake.
                return res.status(500).send({ error: `Opps! ${message}.` });
            }
        };
    }

    protected getUserFromToken(req: Request): AuthTokenSign {
        const user = (req as AuthTokenDetail).user;
        return user;
    }
}
