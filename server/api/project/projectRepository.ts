import Repository from '../repository';
import { ProjectModel } from './projectModel';

export default class ProjectRepository extends Repository {
    async insert(newProject: ProjectModel): Promise<ProjectModel> {
        return new Promise(async (resolve, reject) => {
            const projects = await this.db('projects')
                .insert(newProject)
                .returning('*');

            if (projects.length == 0) {
                reject('failed to create project');
            }

            resolve(projects[0]);
        });
    }

    async findByOrganizationId(
        organizationId: number
    ): Promise<ProjectModel[]> {
        return await this.db('projects').where({
            organization_id: organizationId,
        });
    }

    async findById(id: number): Promise<ProjectModel[]> {
        return await this.db('projects').where({ id });
    }

    async update(id: number, properties: Object): Promise<ProjectModel> {
        return new Promise(async (resolve, reject) => {
            const projects = await this.db('projects')
                .where({ id })
                .update({ ...properties })
                .returning('*');
            if (projects.length == 0) {
                reject('failed to update project');
            }
            resolve(projects[0]);
        });
    }

    async delete(id: number): Promise<ProjectModel> {
        return new Promise(async (resolve, reject) => {
            const results = await this.db('projects')
                .where({ id })
                .del()
                .returning('*');
            if (results.length == 0) {
                reject('failed to delete project');
            }
            resolve(results[0]);
        });
    }
}
