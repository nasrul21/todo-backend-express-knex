import { Request, Response } from 'express';
import TodoService from './todoService';
import { newTodoReponse, TodoRequest } from './todoModel';
import _ from 'lodash';
import Controller from '../controller';
import { httpStatusFromError } from '../common/httpStatus';

export default class TodoController extends Controller {
    private todoService: TodoService;

    constructor(todoService: TodoService) {
        super();
        this.todoService = todoService;
    }

    async getAllTodos(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const user = this.getUserFromToken(req);
            const { projectId } = req.params as { projectId: string };
            const response = await this.todoService.list(
                parseInt(projectId),
                user.id
            );
            return res
                .status(httpStatusFromError(response.error))
                .send(response);
        }, 'Could not fetch all todos')(req, res);
    }

    async getTodo(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const user = this.getUserFromToken(req);
            const { id, projectId } = req.params as {
                id: string;
                projectId: string;
            };
            const response = await this.todoService.get(
                parseInt(id),
                parseInt(projectId),
                user.id
            );
            return res
                .status(httpStatusFromError(response.error))
                .send(response);
        }, 'Could not fetch todo')(req, res);
    }

    async postTodo(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const user = this.getUserFromToken(req);
            const { projectId } = req.params as {
                projectId: string;
            };
            const { title, description, due_date, order } =
                req.body as TodoRequest;
            const response = await this.todoService.create(
                { title, description, due_date, order } as TodoRequest,
                parseInt(projectId),
                user.id
            );
            return res
                .status(httpStatusFromError(response.error))
                .send(response);
        }, 'Could not post todo')(req, res);
    }

    async patchTodo(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const patched = await this.todoService.update(
                parseInt(req.params.id),
                req.body
            );
            return res.send(newTodoReponse(patched));
        }, 'Could not patch todo')(req, res);
    }

    async deleteAllTodos(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const deletedEntries = await this.todoService.clear();
            return res.send(deletedEntries.map(_.curry(newTodoReponse)()));
        }, 'Could not delete all todos')(req, res);
    }

    async deleteTodo(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const deleted = await this.todoService.del(parseInt(req.params.id));
            return res.send(newTodoReponse(deleted));
        }, 'Could not delete todo')(req, res);
    }
}
