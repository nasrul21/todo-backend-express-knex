import { OrganizationModel } from '../organization/organizationModel';

export interface ProjectModel {
    id?: number;
    name: string;
    description: string;
    organization_id: number;
}

export interface CreateProjectRequest {
    name: string;
    description: string;
}

export interface CreateProjectResponse {
    id: number;
    name: string;
    description: string;
    organization: {
        id: number;
        name: string;
    };
}

export function newCreateProjectResponse(
    project: ProjectModel,
    organization: OrganizationModel
): CreateProjectResponse {
    return {
        id: project.id!,
        name: project.name,
        description: project.description,
        organization: {
            id: organization.id!,
            name: organization.name,
        },
    };
}
