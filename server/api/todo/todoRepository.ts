import { Knex } from 'knex';
import { TodoModel } from './todoModel';

export default class TodoRepository {
    private db: Knex;

    constructor(db: Knex) {
        this.db = db;
    }

    async all(): Promise<TodoModel[]> {
        return await this.db('todos');
    }

    async get(id: number): Promise<TodoModel> {
        const results = await this.db('todos').where({ id });
        return results[0];
    }

    async create(title: string, order?: number): Promise<TodoModel> {
        const results = await this.db('todos')
            .insert({ title, order })
            .returning('*');
        return results[0];
    }

    async update(id: number, properties: Object): Promise<TodoModel> {
        const results = await this.db('todos')
            .where({ id })
            .update({ ...properties })
            .returning('*');
        return results[0];
    }

    // delete is a reserved keyword
    async del(id: number): Promise<TodoModel> {
        const results = await this.db('todos')
            .where({ id })
            .del()
            .returning('*');
        return results[0];
    }

    async clear(): Promise<TodoModel[]> {
        return this.db('todos').del().returning('*');
    }
}
