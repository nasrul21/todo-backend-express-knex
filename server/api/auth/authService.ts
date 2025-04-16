import bcrypt from 'bcrypt';
import OrganizationRepository from '../organization/organizationRepository';
import UserRepository from '../user/userRepository';
import {
    newRegisterResponse,
    RegisterRequest,
    RegisterResponse,
} from './authModel';
import UserOrganizationRepository from '../user_organization/userOrganizationRepository';

export default class AuthService {
    private userRepository: UserRepository;
    private organizationRepository: OrganizationRepository;
    private userOrganizationRepository: UserOrganizationRepository;

    private SALT_ROUND = 10;

    constructor(
        userRespository: UserRepository,
        organizationRepository: OrganizationRepository,
        userOrganizationRepository: UserOrganizationRepository
    ) {
        this.userRepository = userRespository;
        this.organizationRepository = organizationRepository;
        this.userOrganizationRepository = userOrganizationRepository;
    }

    async register(
        params: RegisterRequest
    ): Promise<{ data?: RegisterResponse; error?: string }> {
        const users = await this.userRepository.findByEmail(params.email);
        if (users.length > 0) {
            return { error: 'Email already registered' };
        }

        // hash the password
        const salt = await bcrypt.genSalt(this.SALT_ROUND);
        const passwordHash = await bcrypt.hash(params.password, salt);

        // insert new org
        const organization = await this.organizationRepository.insert({
            name: params.organization_name,
        });

        // insert new user
        const newUser = await this.userRepository.insert({
            name: params.name,
            email: params.email,
            password_hash: passwordHash,
        });

        // insert new user organization
        await this.userOrganizationRepository.insert({
            user_id: newUser.id!,
            organization_id: organization.id!,
        });

        const response = newRegisterResponse(newUser, organization);

        return { data: response };
    }
}
