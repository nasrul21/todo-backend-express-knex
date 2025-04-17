import { Knex } from 'knex';
import { TodoModel } from './todoModel';
import Repository from '../repository';

export default class TodoRepository extends Repository {
    async all(): Promise<TodoModel[]> {
        return await this.db('todos');
    }

    async findByProjectId(projectId: number): Promise<TodoModel[]> {
        return await this.db('todos').where({ project_id: projectId });
    }

    async findById(id: number): Promise<TodoModel[]> {
        return await this.db('todos').where({ id });
    }

    async create(todo: TodoModel): Promise<TodoModel> {
        return new Promise(async (resolve, reject) => {
            const results = await this.db('todos').insert(todo).returning('*');

            if (results.length == 0) {
                reject('failed to create todo');
            }
            resolve(results[0]);
        });
    }

    async update(id: number, properties: Object): Promise<TodoModel> {
        return new Promise(async (resolve, reject) => {
            const results = await this.db('todos')
                .where({ id })
                .update({ ...properties })
                .returning('*');
            if (results.length == 0) {
                reject('failed to update todo');
            }
            resolve(results[0]);
        });
    }

    // delete is a reserved keyword
    async del(id: number): Promise<TodoModel> {
        return new Promise(async (resolve, reject) => {
            const results = await this.db('todos')
                .where({ id })
                .del()
                .returning('*');
            if (results.length == 0) {
                reject('failed to delete todo');
            }
            resolve(results[0]);
        });
    }

    async clear(): Promise<TodoModel[]> {
        return new Promise(async (resolve, reject) => {
            const results = await this.db('todos').del().returning('*');
            if (results.length == 0) {
                reject('failed to cleas todos');
            }
            resolve(results[0]);
        });
    }
}
