import { Request, Response, type Express } from 'express';
import TodoRepository from './api/todo/todoRepository';
import dbConnection from './database/connection';
import TodoService from './api/todo/todoService';
import TodoController from './api/todo/todoController';

export default function apiRoutes(app: Express): void {
    const todoRepository = new TodoRepository(dbConnection);
    const todoService = new TodoService(todoRepository);
    const todoController = new TodoController(todoService);

    app.get('/', (req: Request, res: Response) =>
        todoController.getAllTodos(req, res)
    );
    app.get('/todo/:id', (req: Request, res: Response) =>
        todoController.getTodo(req, res)
    );

    app.post('/', (req: Request, res: Response) =>
        todoController.postTodo(req, res)
    );
    app.patch('/:id', (req: Request, res: Response) =>
        todoController.patchTodo(req, res)
    );

    app.delete('/', (req: Request, res: Response) =>
        todoController.deleteAllTodos(req, res)
    );
    app.delete('/:id', (req: Request, res: Response) =>
        todoController.deleteTodo(req, res)
    );
}
