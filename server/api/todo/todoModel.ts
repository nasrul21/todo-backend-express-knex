import { Request } from 'express';

export interface TodoModel {
    id: number;
    title: string;
    order: number;
    completed: boolean;
    description: string;
    status: string;
    due_date: Date;
    project_id: number;
    created_by: number;
}

export interface TodoResponse {
    id: number;
    title: string;
    order: number;
    completed: boolean;
    description: string;
    status: string;
    due_date: Date;
    project_id: number;
    created_by: number;
    url: string;
}

export function newTodoReponse(req: Request, data: TodoModel): TodoResponse {
    const protocol = req.protocol,
        host = req.get('host'),
        id = data.id;

    return {
        id: id,
        title: data.title,
        order: data.order,
        completed: data.completed || false,
        url: `${protocol}://${host}/${id}`,
        description: data.description,
        status: data.status,
        due_date: data.due_date,
        project_id: data.project_id,
        created_by: data.created_by,
    };
}
