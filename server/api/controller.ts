import { Request, Response } from 'express';

export default class Controller {
    addErrorReporting(func: Function, message: string) {
        return async function (req: Request, res: Response) {
            try {
                return await func(req, res);
            } catch (err) {
                console.log(`${message} caused by: ${err}`);

                // Not always 500, but for simplicity's sake.
                return res.status(500).send(`Opps! ${message}.`);
            }
        };
    }
}
