import { TodoModel } from './todoModel';
import TodoRepository from './todoRepository';

export default class TodoService {
    private todoRepository: TodoRepository;

    constructor(todoRepository: TodoRepository) {
        this.todoRepository = todoRepository;
    }

    async all(): Promise<TodoModel[]> {
        return await this.todoRepository.all();
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
