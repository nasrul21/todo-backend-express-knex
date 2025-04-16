import Repository from '../repository';
import { OrganizationModel } from './organizationModel';

export default class OrganizationRepository extends Repository {
    async insert(
        newOrganization: OrganizationModel
    ): Promise<OrganizationModel> {
        return new Promise(async (resolve, reject) => {
            const organizations = await this.db('organizations')
                .insert(newOrganization)
                .returning('*');

            if (organizations.length == 0) {
                reject('failed to create organization');
            }

            resolve(organizations[0]);
        });
    }
}
