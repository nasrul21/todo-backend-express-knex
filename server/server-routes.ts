import { Request, Response } from 'express';

const _ = require('lodash');
const todos = require('./database/todo-queries');

function createToDo(req: Request, data: any) {
    const protocol = req.protocol,
        host = req.get('host'),
        id = data.id;

    return {
        title: data.title,
        order: data.order,
        completed: data.completed || false,
        url: `${protocol}://${host}/${id}`,
    };
}

async function getAllTodos(req: Request, res: Response) {
    const allEntries = await todos.all();
    return res.send(allEntries.map(_.curry(createToDo)(req)));
}

async function getTodo(req: Request, res: Response) {
    const todo = await todos.get(req.params.id);
    return res.send(todo);
}

async function postTodo(req: Request, res: Response) {
    const created = await todos.create(req.body.title, req.body.order);
    return res.send(createToDo(req, created));
}

async function patchTodo(req: Request, res: Response) {
    const patched = await todos.update(req.params.id, req.body);
    return res.send(createToDo(req, patched));
}

async function deleteAllTodos(req: Request, res: Response) {
    const deletedEntries = await todos.clear();
    return res.send(deletedEntries.map(_.curry(createToDo)(req)));
}

async function deleteTodo(req: Request, res: Response) {
    const deleted = await todos.delete(req.params.id);
    return res.send(createToDo(req, deleted));
}

function addErrorReporting(func: Function, message: string) {
    return async function (req: Request, res: Response) {
        try {
            return await func(req, res);
        } catch (err) {
            console.log(`${message} caused by: ${err}`);

            // Not always 500, but for simplicity's sake.
            res.status(500).send(`Opps! ${message}.`);
        }
    };
}

const toExport: any = {
    getAllTodos: {
        method: getAllTodos,
        errorMessage: 'Could not fetch all todos',
    },
    getTodo: { method: getTodo, errorMessage: 'Could not fetch todo' },
    postTodo: { method: postTodo, errorMessage: 'Could not post todo' },
    patchTodo: { method: patchTodo, errorMessage: 'Could not patch todo' },
    deleteAllTodos: {
        method: deleteAllTodos,
        errorMessage: 'Could not delete all todos',
    },
    deleteTodo: { method: deleteTodo, errorMessage: 'Could not delete todo' },
};

for (let route in toExport) {
    toExport[route] = addErrorReporting(
        toExport[route].method,
        toExport[route].errorMessage
    );
}

module.exports = toExport;
