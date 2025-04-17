import { Request, Response } from 'express';
import Controller from '../controller';
import ProjectService from './projectService';
import { AuthTokenDetail } from '../auth/authModel';
import { CreateProjectRequest, UpdateProjectRequest } from './projectModel';
import { httpStatusFromError } from '../common/httpStatus';

export default class ProjectController extends Controller {
    private projectService: ProjectService;

    constructor(projectService: ProjectService) {
        super();
        this.projectService = projectService;
    }

    async create(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const user = (req as AuthTokenDetail).user;
            const { name, description } = req.body as CreateProjectRequest;
            const { orgId } = req.params as { orgId: string };
            const response = await this.projectService.create(
                { name, description },
                user.id,
                parseInt(orgId)
            );

            return res
                .status(httpStatusFromError(response.error))
                .json(response);
        }, 'failed to create new project')(req, res);
    }

    async list(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const user = (req as AuthTokenDetail).user;
            const { orgId } = req.params as { orgId: string };
            const response = await this.projectService.list(
                parseInt(orgId),
                user.id
            );

            return res
                .status(httpStatusFromError(response.error))
                .json(response);
        }, 'failed to get list of projects')(req, res);
    }

    async update(req: Request, res: Response) {
        return this.addErrorReporting(async (req: Request, res: Response) => {
            const user = (req as AuthTokenDetail).user;
            const { projectId } = req.params as { projectId: string };
            const { name, description } = req.body as UpdateProjectRequest;
            const response = await this.projectService.update(
                { name, description },
                parseInt(projectId),
                user.id
            );

            return res
                .status(httpStatusFromError(response.error))
                .json(response);
        }, 'failed to update the projects')(req, res);
    }
}
