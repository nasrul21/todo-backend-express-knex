import { Request } from 'express';

export interface TodoModel {
    id?: number;
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
}

export function newTodoReponse(data: TodoModel): TodoResponse {
    return {
        id: data.id!,
        title: data.title,
        order: data.order,
        completed: data.completed || false,
        description: data.description,
        status: data.status,
        due_date: data.due_date,
        project_id: data.project_id,
        created_by: data.created_by,
    };
}
