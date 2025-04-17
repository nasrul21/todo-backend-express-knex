import { Request, Response } from 'express';
import TodoService from './todoService';
import { newTodoReponse } from './todoModel';
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
            const id = parseInt(req.params.id);
            const todo = await this.todoService.get(id);
            return res.send(todo);
        }, 'Could not fetch todo')(req, res);
    }

    async postTodo(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const created = await this.todoService.create(
                req.body.title,
                req.body.order
            );
            return res.send(newTodoReponse(created));
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
