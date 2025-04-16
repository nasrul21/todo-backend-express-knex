import { Request, Response } from 'express';
import Controller from '../controller';
import AuthService from './authService';
import { RegisterRequest } from './authModel';

export default class AuthController extends Controller {
    private authService: AuthService;

    constructor(authService: AuthService) {
        super();
        this.authService = authService;
    }

    async register(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const { name, email, password, organization_name } =
                req.body as RegisterRequest;
            const response = await this.authService.register({
                email,
                name,
                password,
                organization_name,
            } as RegisterRequest);
            return res.send(response);
        }, 'failed to register new users')(req, res);
    }
}
