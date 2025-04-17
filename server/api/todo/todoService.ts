import { BaseResponse } from '../common/baseResponse';
import {
    ErrForbiddenAccessOrganization,
    ErrInvalidProject,
} from '../common/error';
import ProjectRepository from '../project/projectRepository';
import UserOrganizationRepository from '../user_organization/userOrganizationRepository';
import { newTodoReponse, TodoModel, TodoResponse } from './todoModel';
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

        const todos = await this.todoRepository.findByProjectId(projectId);

        const response = todos.map((todo) => newTodoReponse(todo));
        return { data: response };
    }

    async get(id: number): Promise<TodoModel> {
        return await this.todoRepository.get(id);
    }

    async create(title: string, order?: number): Promise<TodoModel> {
        return await this.todoRepository.create(title, order);
    }

    async update(id: number, properties: Object): Promise<TodoModel> {
        return await this.todoRepository.update(id, properties);
    }

    // delete is a reserved keyword
    async del(id: number): Promise<TodoModel> {
        return await this.todoRepository.del(id);
    }

    async clear(): Promise<TodoModel[]> {
        return await this.todoRepository.clear();
    }
}
