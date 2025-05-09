import { NextFunction, Request, Response, Router, type Express } from 'express';
import TodoRepository from './api/todo/todoRepository';
import dbConnection from './database/connection';
import TodoService from './api/todo/todoService';
import TodoController from './api/todo/todoController';
import UserRepository from './api/user/userRepository';
import OrganizationRepository from './api/organization/organizationRepository';
import AuthService from './api/auth/authService';
import AuthController from './api/auth/authController';
import UserOrganizationRepository from './api/user_organization/userOrganizationRepository';
import ProjectRepository from './api/project/projectRepository';
import ProjectService from './api/project/projectService';
import ProjectController from './api/project/projectController';
import { authMiddleware } from './api/common/middleware';
import CommentRepository from './api/comment/commentRepository';
import CommentService from './api/comment/commentService';
import CommentController from './api/comment/commentController';

export const routers = Router();

// repositories
const todoRepository = new TodoRepository(dbConnection);
const userRepository = new UserRepository(dbConnection);
const organizationRepository = new OrganizationRepository(dbConnection);
const userOrganizationRepository = new UserOrganizationRepository(dbConnection);
const projectRepository = new ProjectRepository(dbConnection);
const commentRepository = new CommentRepository(dbConnection);

// services
const todoService = new TodoService(
    todoRepository,
    projectRepository,
    userOrganizationRepository
);
const authService = new AuthService(
    userRepository,
    organizationRepository,
    userOrganizationRepository
);
const projectService = new ProjectService(
    projectRepository,
    organizationRepository,
    userOrganizationRepository
);
const commentService = new CommentService(
    commentRepository,
    todoRepository,
    projectRepository,
    userOrganizationRepository
);

// controllers
const todoController = new TodoController(todoService);
const authController = new AuthController(authService);
const projectController = new ProjectController(projectService);
const commentController = new CommentController(commentService);

// Start Public Routes
// Auth Routes
routers.post('/auth/register', (req: Request, res: Response) =>
    authController.register(req, res)
);
routers.post('/auth/login', (req: Request, res: Response) => {
    authController.login(req, res);
});
// End Public Routes

// Start Private Routes
routers.use((req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, next);
});
routers.get('/projects/:projectId/todo', (req: Request, res: Response) =>
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    todoController.getAllTodos(req, res)
);
routers.get('/projects/:projectId/todo/:id', (req: Request, res: Response) =>
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    todoController.getTodo(req, res)
);
routers.post('/projects/:projectId/todo', (req: Request, res: Response) =>
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    todoController.postTodo(req, res)
);
routers.patch('/todo/:id', (req: Request, res: Response) =>
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    todoController.patchTodo(req, res)
);
routers.delete('/projects/:projectId/todo', (req: Request, res: Response) =>
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    todoController.deleteAllTodos(req, res)
);
routers.delete('/todo/:id', (req: Request, res: Response) =>
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    todoController.deleteTodo(req, res)
);

// Project Routes
routers.post('/organizations/:orgId/projects', (req: Request, res: Response) =>
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    projectController.create(req, res)
);
routers.get('/organizations/:orgId/projects', (req: Request, res: Response) =>
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    projectController.list(req, res)
);
routers.patch('/projects/:projectId', (req: Request, res: Response) =>
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    projectController.update(req, res)
);
routers.delete('/projects/:projectId', (req: Request, res: Response) =>
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    projectController.delete(req, res)
);

// Comment Routes
routers.post('/todos/:todoId/comments', (req: Request, res: Response) =>
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    commentController.create(req, res)
);
routers.get('/todos/:todoId/comments', (req: Request, res: Response) =>
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    commentController.list(req, res)
);
routers.patch('/comments/:commentId', (req: Request, res: Response) =>
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    commentController.update(req, res)
);
routers.delete('/comment/:commentId', (req: Request, res: Response) =>
    /* #swagger.security = [{
            "bearerAuth": []
    }] */
    commentController.delete(req, res)
);

// End Private Routes
