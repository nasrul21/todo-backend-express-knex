import {
    ErrAuthEmailAlreadyRegistered,
    ErrAuthInvalidLoginCredential,
    ErrAuthUserNotFound,
    ErrForbiddenAccessOrganization,
    ErrForbiddenCreateProject,
    ErrInvalidOrganization,
    ErrInvalidProject,
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
};

export function httpStatusFromError(error?: string): number {
    if (!error) {
        return StatusOK;
    }
    return MapHttpStatusByError[error];
}
