import { BaseResponse } from '../common/baseResponse';
import {
    ErrForbiddenAccessOrganization,
    ErrForbiddenCreateProject,
    ErrInvalidOrganization,
    ErrInvalidProject,
} from '../common/error';
import { OrganizationModel } from '../organization/organizationModel';
import OrganizationRepository from '../organization/organizationRepository';
import {
    UserOrganizationEnum,
    UserOrganizationModel,
} from '../user_organization/userOrganizationModel';
import UserOrganizationRepository from '../user_organization/userOrganizationRepository';
import {
    CreateProjectRequest,
    CreateProjectResponse,
    DeleteProjectResponse,
    GetProjectResponse,
    newCreateProjectResponse,
    newGetProjectResponse,
    newUpdateProjectResponse,
    UpdateProjectRequest,
    UpdateProjectResponse,
} from './projectModel';
import ProjectRepository from './projectRepository';

export default class ProjectService {
    private projectRepository: ProjectRepository;
    private organizationRepository: OrganizationRepository;
    private userOrganizationRepository: UserOrganizationRepository;

    constructor(
        projectRepository: ProjectRepository,
        organizationRepository: OrganizationRepository,
        userOrganizationRepository: UserOrganizationRepository
    ) {
        this.projectRepository = projectRepository;
        this.organizationRepository = organizationRepository;
        this.userOrganizationRepository = userOrganizationRepository;
    }

    async create(
        params: CreateProjectRequest,
        userId: number,
        organizationId: number
    ): Promise<BaseResponse<CreateProjectResponse>> {
        const validationResult = await this.validateUserOrganization(
            organizationId,
            userId
        );

        if (validationResult.error) {
            return { error: validationResult.error };
        }

        const { organization, userOrganization } = validationResult.data!;

        if (userOrganization.role != UserOrganizationEnum.Admin) {
            return {
                error: ErrForbiddenCreateProject,
            };
        }

        const project = await this.projectRepository.insert({
            name: params.name,
            description: params.description,
            organization_id: organization.id!,
        });

        const response = newCreateProjectResponse(project, organization);

        return { data: response };
    }

    async list(
        organizationId: number,
        userId: number
    ): Promise<BaseResponse<GetProjectResponse[]>> {
        const validationResult = await this.validateUserOrganization(
            organizationId,
            userId
        );

        if (validationResult.error) {
            return { error: validationResult.error };
        }

        const { organization, userOrganization } = validationResult.data!;

        const projects = await this.projectRepository.findByOrganizationId(
            organization.id!
        );

        const response = projects.map((project) =>
            newGetProjectResponse(project)
        );

        return { data: response };
    }

    async update(
        params: UpdateProjectRequest,
        id: number,
        userId: number
    ): Promise<BaseResponse<UpdateProjectResponse>> {
        const projects = await this.projectRepository.findById(id);
        if (projects.length == 0) {
            return { error: ErrInvalidProject };
        }
        const project = projects[0];
        const validationResult = await this.validateUserOrganization(
            project.organization_id,
            userId
        );

        if (validationResult.error) {
            return { error: validationResult.error };
        }

        const updatedProject = await this.projectRepository.update(id, {
            ...params,
        });

        const response = newUpdateProjectResponse(updatedProject);
        return { data: response };
    }

    async delete(
        id: number,
        userId: number
    ): Promise<BaseResponse<DeleteProjectResponse>> {
        const projects = await this.projectRepository.findById(id);
        if (projects.length == 0) {
            return { error: ErrInvalidProject };
        }
        const project = projects[0];
        const validationResult = await this.validateUserOrganization(
            project.organization_id,
            userId
        );

        if (validationResult.error) {
            return { error: validationResult.error };
        }

        const deletedProject = await this.projectRepository.delete(id);

        const response: DeleteProjectResponse = { id: deletedProject.id! };
        return { data: response };
    }

    private async validateUserOrganization(
        organizationId: number,
        userId: number
    ): Promise<
        BaseResponse<{
            organization: OrganizationModel;
            userOrganization: UserOrganizationModel;
        }>
    > {
        const organizations =
            await this.organizationRepository.findById(organizationId);
        if (organizations.length == 0) {
            return { error: ErrInvalidOrganization };
        }
        const organization = organizations[0];

        const userOrganizations =
            await this.userOrganizationRepository.findByUserAndOrganization(
                userId,
                organization.id!
            );
        if (userOrganizations.length == 0) {
            return {
                error: ErrForbiddenAccessOrganization,
            };
        }

        const userOrganization = userOrganizations[0];

        return {
            data: {
                organization,
                userOrganization,
            },
        };
    }
}
