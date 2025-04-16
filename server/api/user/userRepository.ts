import Repository from '../repository';
import { UserModel } from './userModel';

export default class UserRepository extends Repository {
    async findByEmail(email: string): Promise<UserModel[]> {
        const users = await this.db('users').where({ email });
        return users;
    }

    async insert(user: UserModel): Promise<UserModel> {
        return new Promise(async (resolve, reject) => {
            const users = await this.db('users').insert(user).returning('*');

            if (users.length == 0) {
                reject('failed to insert new user');
            }

            resolve(users[0]);
        });
    }
}
