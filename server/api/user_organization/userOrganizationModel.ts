export interface UserOrganizationModel {
    id?: number;
    user_id: number;
    organization_id: number;
    role: UserOrganizationEnum;
}

export enum UserOrganizationEnum {
    Admin = 'admin',
    Member = 'member',
}
