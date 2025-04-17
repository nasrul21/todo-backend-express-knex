import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { BaseResponse } from './baseResponse';
import { AuthTokenDetail, AuthTokenSign } from '../auth/authModel';

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token)
        return res
            .status(401)
            .json({ error: 'Unautorized' } as BaseResponse<undefined>);

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err)
            return res
                .status(403)
                .json({ error: 'Forbidden' } as BaseResponse<undefined>);

        (req as AuthTokenDetail).user = user as AuthTokenSign;

        next();
    });
}
