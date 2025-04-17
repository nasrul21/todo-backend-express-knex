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
}
