import {
    ErrForbiddenAccessOrganization,
    ErrForbiddenCreateProject,
    ErrInvalidOrganization,
} from './error';

const StatusOK: number = 200;
const StatusForbidden: number = 403;
const StatusUnauthorized: number = 401;

const MapHttpStatusByError: { [error: string]: number } = {
    [ErrForbiddenAccessOrganization]: StatusForbidden,
    [ErrForbiddenCreateProject]: StatusForbidden,
    [ErrInvalidOrganization]: StatusForbidden,
};

export function httpStatusFromError(error?: string): number {
    if (!error) {
        return StatusOK;
    }
    return MapHttpStatusByError[error];
}
