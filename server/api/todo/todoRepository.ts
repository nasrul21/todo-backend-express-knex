import { Knex } from 'knex';
import { TodoModel } from './todoModel';
import { reject } from 'lodash';

export default class TodoRepository {
    private db: Knex;

    constructor(db: Knex) {
        this.db = db;
    }

    async all(): Promise<TodoModel[]> {
        return await this.db('todos');
    }

    async get(id: number): Promise<TodoModel> {
        return new Promise(async (resolve, reject) => {
            const results = await this.db('todos').where({ id });
            if (results.length == 0) {
                reject('todo is not found');
            }
            resolve(results[0]);
        });
    }

    async create(title: string, order?: number): Promise<TodoModel> {
        return new Promise(async (resolve, reject) => {
            const results = await this.db('todos')
                .insert({ title, order })
                .returning('*');

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
                reject('failed to update todo');
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
