import Repository from '../repository';
import { UserOrganizationModel } from './userOrganizationModel';

export default class UserOrganizationRepository extends Repository {
    async insert(
        newUserOrganization: UserOrganizationModel
    ): Promise<UserOrganizationModel> {
        return new Promise(async (resolve, reject) => {
            const userOrganizations = await this.db('user_organizations')
                .insert(newUserOrganization)
                .returning('*');

            if (userOrganizations.length == 0) {
                reject('failed to create user organization');
            }

            resolve(userOrganizations[0]);
        });
    }

    async findByUserAndOrganization(
        user_id: number,
        organization_id: number
    ): Promise<UserOrganizationModel[]> {
        return await this.db('user_organizations').where({
            user_id,
            organization_id,
        });
    }
}
