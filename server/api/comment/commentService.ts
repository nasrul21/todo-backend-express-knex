import { AuthTokenSign } from '../auth/authModel';
import { BaseResponse } from '../common/baseResponse';
import {
    ErrForbiddenAccessOrganization,
    ErrForbiddenAccessProject,
    ErrInvalidProject,
    ErrInvalidTodo,
} from '../common/error';
import { ProjectModel } from '../project/projectModel';
import ProjectRepository from '../project/projectRepository';
import { TodoModel } from '../todo/todoModel';
import TodoRepository from '../todo/todoRepository';
import { UserOrganizationModel } from '../user_organization/userOrganizationModel';
import UserOrganizationRepository from '../user_organization/userOrganizationRepository';
import {
    CreateCommentRequest,
    CreateCommentResponse,
    GetCommentResponse,
    newCreateCommentResponse,
    newGetCommentResponse,
} from './commentModel';
import CommentRepository from './commentRepository';

export default class CommentService {
    private commentRepository: CommentRepository;
    private todoRepository: TodoRepository;
    private projectRepository: ProjectRepository;
    private userOrganizationRepository: UserOrganizationRepository;

    constructor(
        commentRepository: CommentRepository,
        todoRepository: TodoRepository,
        projectRepository: ProjectRepository,
        userOrganizationRepository: UserOrganizationRepository
    ) {
        this.commentRepository = commentRepository;
        this.todoRepository = todoRepository;
        this.projectRepository = projectRepository;
        this.userOrganizationRepository = userOrganizationRepository;
    }

    async create(
        params: CreateCommentRequest,
        todoId: number,
        user: AuthTokenSign
    ): Promise<BaseResponse<CreateCommentResponse>> {
        const validateResult = await this.validateTodoProjectAndOrganization(
            todoId,
            user.id
        );
        if (validateResult.error) {
            return { error: validateResult.error };
        }

        const comment = await this.commentRepository.insert({
            content: params.content,
            created_at: new Date(),
            todo_id: todoId,
            user_id: user.id,
        });

        const response = newCreateCommentResponse(comment, user);
        return { data: response };
    }

    async list(
        todoId: number,
        userId: number
    ): Promise<BaseResponse<GetCommentResponse[]>> {
        const validateResult = await this.validateTodoProjectAndOrganization(
            todoId,
            userId
        );
        if (validateResult.error) {
            return { error: validateResult.error };
        }

        const comments = await this.commentRepository.findByTodoId(todoId);

        const response = comments.map((comment) =>
            newGetCommentResponse(comment)
        );
        return { data: response };
    }

    private async validateTodoProjectAndOrganization(
        todoId: number,
        userId: number
    ): Promise<
        BaseResponse<{
            todo: TodoModel;
            project: ProjectModel;
            userOrganization: UserOrganizationModel;
        }>
    > {
        const todos = await this.todoRepository.findById(todoId);
        if (todos.length == 0) {
            return { error: ErrInvalidTodo };
        }
        const todo = todos[0];

        const projects = await this.projectRepository.findById(todo.project_id);
        if (projects.length == 0) {
            return { error: ErrForbiddenAccessProject };
        }
        const project = projects[0];

        const userOrganizations =
            await this.userOrganizationRepository.findByUserAndOrganization(
                userId,
                project.organization_id
            );
        if (userOrganizations.length == 0) {
            return { error: ErrForbiddenAccessOrganization };
        }
        const userOrganization = userOrganizations[0];

        return { data: { todo, project, userOrganization } };
    }
}
