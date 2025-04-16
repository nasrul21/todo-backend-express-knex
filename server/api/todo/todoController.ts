import { Request, Response } from 'express';
import TodoService from './todoService';
import { newTodoReponse } from './todoModel';
import _ from 'lodash';
import Controller from '../controller';

export default class TodoController extends Controller {
    private todoService: TodoService;

    constructor(todoService: TodoService) {
        super();
        this.todoService = todoService;
    }

    async getAllTodos(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const allEntries = await this.todoService.all();
            return res.send(allEntries.map(_.curry(newTodoReponse)(req)));
        }, 'Could not fetch all todos')(req, res);
    }

    async getTodo(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const id = parseInt(req.params.id);
            console.log('ID: ', id);
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
            return res.send(newTodoReponse(req, created));
        }, 'Could not post todo')(req, res);
    }

    async patchTodo(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const patched = await this.todoService.update(
                parseInt(req.params.id),
                req.body
            );
            return res.send(newTodoReponse(req, patched));
        }, 'Could not patch todo')(req, res);
    }

    async deleteAllTodos(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const deletedEntries = await this.todoService.clear();
            return res.send(deletedEntries.map(_.curry(newTodoReponse)(req)));
        }, 'Could not delete all todos')(req, res);
    }

    async deleteTodo(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const deleted = await this.todoService.del(parseInt(req.params.id));
            return res.send(newTodoReponse(req, deleted));
        }, 'Could not delete todo')(req, res);
    }
}
