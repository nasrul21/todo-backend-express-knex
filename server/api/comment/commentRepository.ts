import Repository from '../repository';
import { CommentModel } from './commentModel';

export default class CommentRepository extends Repository {
    async insert(newComment: CommentModel): Promise<CommentModel> {
        return new Promise(async (resolve, reject) => {
            const comments = await this.db('comments')
                .insert(newComment)
                .returning('*');

            if (comments.length == 0) {
                reject('failed to create comment');
            }

            resolve(comments[0]);
        });
    }

    async findByTodoId(todoId: number): Promise<CommentModel[]> {
        return await this.db('comments').where({
            todo_id: todoId,
        });
    }

    async findById(id: number): Promise<CommentModel[]> {
        return await this.db('comments').where({ id });
    }

    async update(id: number, properties: Object): Promise<CommentModel> {
        return new Promise(async (resolve, reject) => {
            const comments = await this.db('comments')
                .where({ id })
                .update({ ...properties })
                .returning('*');
            if (comments.length == 0) {
                reject('failed to update comment');
            }
            resolve(comments[0]);
        });
    }

    async delete(id: number): Promise<CommentModel> {
        return new Promise(async (resolve, reject) => {
            const results = await this.db('comments')
                .where({ id })
                .del()
                .returning('*');
            if (results.length == 0) {
                reject('failed to delete comment');
            }
            resolve(results[0]);
        });
    }
}
