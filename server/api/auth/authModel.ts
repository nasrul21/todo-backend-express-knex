import { OrganizationModel } from '../organization/organizationModel';
import { UserModel } from '../user/userModel';

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    organization_name: string;
}

export interface RegisterResponse {
    id: number;
    name: string;
    email: string;
    organization: {
        id: number;
        name: string;
    };
}

export function newRegisterResponse(
    user: UserModel,
    organization: OrganizationModel
): RegisterResponse {
    return {
        id: user.id!,
        name: user.name,
        email: user.email,
        organization: {
            id: organization.id!,
            name: organization.name,
        },
    };
}
