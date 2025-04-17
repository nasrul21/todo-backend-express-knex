import { BaseResponse } from '../common/baseResponse';
import {
    ErrForbiddenAccessOrganization,
    ErrForbiddenAccessProject,
    ErrInvalidProject,
    ErrInvalidTodo,
} from '../common/error';
import { ProjectModel } from '../project/projectModel';
import ProjectRepository from '../project/projectRepository';
import { UserOrganizationModel } from '../user_organization/userOrganizationModel';
import UserOrganizationRepository from '../user_organization/userOrganizationRepository';
import {
    newTodoReponse,
    TodoModel,
    TodoRequest,
    TodoResponse,
    TodoStatusWaiting,
    UpdateTodoRequest,
} from './todoModel';
import TodoRepository from './todoRepository';

export default class TodoService {
    private todoRepository: TodoRepository;
    private projectRepository: ProjectRepository;
    private userOrganizationRepository: UserOrganizationRepository;

    constructor(
        todoRepository: TodoRepository,
        projectRepository: ProjectRepository,
        userOrganizationRepository: UserOrganizationRepository
    ) {
        this.todoRepository = todoRepository;
        this.projectRepository = projectRepository;
        this.userOrganizationRepository = userOrganizationRepository;
    }

    async list(
        projectId: number,
        userId: number
    ): Promise<BaseResponse<TodoResponse[]>> {
        const validationResult = await this.validateProjectAndUserOrganization(
            projectId,
            userId
        );

        if (validationResult.error) {
            return { error: validationResult.error };
        }

        const todos = await this.todoRepository.findByProjectId(projectId);

        const response = todos.map((todo) => newTodoReponse(todo));
        return { data: response };
    }

    async get(
        id: number,
        projectId: number,
        userId: number
    ): Promise<BaseResponse<TodoResponse>> {
        const validationResult = await this.validateProjectAndUserOrganization(
            projectId,
            userId
        );

        if (validationResult.error) {
            return { error: validationResult.error };
        }
        const todos = await this.todoRepository.findById(id);
        if (todos.length == 0) {
            return { error: ErrInvalidTodo };
        }
        const todo = todos[0];

        if (todo.project_id != projectId) {
            return { error: ErrForbiddenAccessProject };
        }

        const response = newTodoReponse(todos[0]);
        return { data: response };
    }

    async create(
        params: TodoRequest,
        projectId: number,
        userId: number
    ): Promise<BaseResponse<TodoResponse>> {
        const validationResult = await this.validateProjectAndUserOrganization(
            projectId,
            userId
        );

        if (validationResult.error) {
            return { error: validationResult.error };
        }
        const todo = await this.todoRepository.create({
            title: params.title,
            description: params.description,
            completed: false,
            due_date: params.due_date,
            order: params.order,
            project_id: projectId,
            status: TodoStatusWaiting,
            created_by: userId,
        });

        const response = newTodoReponse(todo);
        return { data: response };
    }

    async update(
        params: UpdateTodoRequest,
        id: number,
        userId: number
    ): Promise<BaseResponse<TodoResponse>> {
        const todos = await this.todoRepository.findById(id);
        if (todos.length == 0) {
            return { error: ErrInvalidTodo };
        }
        const todo = todos[0];

        const validationResult = await this.validateProjectAndUserOrganization(
            todo.project_id,
            userId
        );

        if (validationResult.error) {
            return { error: validationResult.error };
        }

        const updatedTodo = await this.todoRepository.update(id, { ...params });

        const response = newTodoReponse(updatedTodo);
        return { data: response };
    }

    // delete is a reserved keyword
    async del(id: number, userId: number): Promise<BaseResponse<TodoResponse>> {
        const todos = await this.todoRepository.findById(id);
        if (todos.length == 0) {
            return { error: ErrInvalidTodo };
        }
        const todo = todos[0];

        const validationResult = await this.validateProjectAndUserOrganization(
            todo.project_id,
            userId
        );

        if (validationResult.error) {
            return { error: validationResult.error };
        }
        const deletedTodo = await this.todoRepository.del(id);

        const response = newTodoReponse(deletedTodo);
        return { data: response };
    }

    async clear(
        projectId: number,
        userId: number
    ): Promise<BaseResponse<TodoResponse[]>> {
        const validationResult = await this.validateProjectAndUserOrganization(
            projectId,
            userId
        );

        if (validationResult.error) {
            return { error: validationResult.error };
        }
        const todos = await this.todoRepository.clear(projectId);

        const response = todos.map((todo) => newTodoReponse(todo));
        return { data: response };
    }

    protected async validateProjectAndUserOrganization(
        projectId: number,
        userId: number
    ): Promise<
        BaseResponse<{
            project: ProjectModel;
            userOrganization: UserOrganizationModel;
        }>
    > {
        const projects = await this.projectRepository.findById(projectId);
        if (projects.length == 0) {
            return { error: ErrInvalidProject };
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

        return {
            data: {
                project,
                userOrganization,
            },
        };
    }
}
