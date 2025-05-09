import {
    ErrAuthEmailAlreadyRegistered,
    ErrAuthInvalidLoginCredential,
    ErrAuthUserNotFound,
    ErrForbiddenAccessOrganization,
    ErrForbiddenAccessProject,
    ErrForbiddenCreateProject,
    ErrInvalidOrganization,
    ErrInvalidProject,
    ErrInvalidTodo,
} from './error';

const StatusOK: number = 200;
const StatusForbidden: number = 403;
const StatusUnauthorized: number = 401;
const StatusNotFound: number = 404;
const StatusBadRequest: number = 400;

const MapHttpStatusByError: { [error: string]: number } = {
    [ErrForbiddenAccessOrganization]: StatusForbidden,
    [ErrForbiddenCreateProject]: StatusForbidden,
    [ErrInvalidOrganization]: StatusForbidden,
    [ErrAuthEmailAlreadyRegistered]: StatusBadRequest,
    [ErrAuthInvalidLoginCredential]: StatusBadRequest,
    [ErrAuthUserNotFound]: StatusBadRequest,
    [ErrInvalidProject]: StatusBadRequest,
    [ErrInvalidTodo]: StatusBadRequest,
    [ErrForbiddenAccessProject]: StatusForbidden,
};

export function httpStatusFromError(error?: string): number {
    if (!error) {
        return StatusOK;
    }
    return MapHttpStatusByError[error];
}
