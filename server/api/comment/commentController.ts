import { Request, Response } from 'express';
import { AuthTokenDetail } from '../auth/authModel';
import Controller from '../controller';
import { CreateCommentRequest } from './commentModel';
import CommentService from './commentService';
import { httpStatusFromError } from '../common/httpStatus';

export default class CommentController extends Controller {
    private commentService: CommentService;

    constructor(commentService: CommentService) {
        super();
        this.commentService = commentService;
    }

    async create(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const user = (req as AuthTokenDetail).user;
            const { content } = req.body as CreateCommentRequest;
            const { todoId } = req.params as { todoId: string };
            const response = await this.commentService.create(
                { content },
                parseInt(todoId),
                user
            );

            return res
                .status(httpStatusFromError(response.error))
                .json(response);
        }, 'failed to create new comment')(req, res);
    }

    async list(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const user = (req as AuthTokenDetail).user;
            const { todoId } = req.params as { todoId: string };
            const response = await this.commentService.list(
                parseInt(todoId),
                user.id
            );

            return res
                .status(httpStatusFromError(response.error))
                .json(response);
        }, 'failed to get list of comments')(req, res);
    }
}
