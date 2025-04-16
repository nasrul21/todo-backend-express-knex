import { Request, Response, Router, type Express } from 'express';
import TodoRepository from './api/todo/todoRepository';
import dbConnection from './database/connection';
import TodoService from './api/todo/todoService';
import TodoController from './api/todo/todoController';

export const todoRouter = Router();

const todoRepository = new TodoRepository(dbConnection);
const todoService = new TodoService(todoRepository);
const todoController = new TodoController(todoService);

todoRouter.get('/todo', (req: Request, res: Response) =>
    todoController.getAllTodos(req, res)
);
todoRouter.get('/todo/:id', (req: Request, res: Response) =>
    todoController.getTodo(req, res)
);

todoRouter.post('/todo', (req: Request, res: Response) =>
    todoController.postTodo(req, res)
);
todoRouter.patch('/todo/:id', (req: Request, res: Response) =>
    todoController.patchTodo(req, res)
);

todoRouter.delete('/todo', (req: Request, res: Response) =>
    todoController.deleteAllTodos(req, res)
);
todoRouter.delete('/todo/:id', (req: Request, res: Response) =>
    todoController.deleteTodo(req, res)
);
