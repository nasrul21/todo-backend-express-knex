import { AuthTokenSign } from '../auth/authModel';

export interface CommentModel {
    id?: number;
    content: string;
    todo_id: number;
    user_id: number;
    created_at: Date;
}

export interface CreateCommentRequest {
    content: string;
}

export interface CreateCommentResponse {
    id: number;
    content: string;
    todo_id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    created_at: Date;
}

export function newCreateCommentResponse(
    comment: CommentModel,
    user: AuthTokenSign
): CreateCommentResponse {
    return {
        id: comment.id!,
        content: comment.content,
        todo_id: comment.todo_id,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        created_at: comment.created_at,
    };
}
