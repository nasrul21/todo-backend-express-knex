import { Request } from 'express';

export const TodoStatusWaiting = 'waiting';
export const TodoStatusInProgress = 'in progress';
export const TodoStatusInReview = 'in review';
export const TodoStatusReadyToTest = 'ready to test';
export const TodoStatusInTesting = 'in testing';
export const TodoStatusReadyToDeploy = 'ready to deploy';
export const TodoStatusCompleted = 'completed';

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

export interface TodoRequest {
    title: string;
    order: number;
    description: string;
    due_date: Date;
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
