import bcrypt from 'bcrypt';
import OrganizationRepository from '../organization/organizationRepository';
import UserRepository from '../user/userRepository';
import {
    newRegisterResponse,
    RegisterRequest,
    RegisterResponse,
} from './authModel';

export default class AuthService {
    private userRepository: UserRepository;
    private organizationRepository: OrganizationRepository;

    private SALT_ROUND = 10;

    constructor(
        userRespository: UserRepository,
        organizationRepository: OrganizationRepository
    ) {
        this.userRepository = userRespository;
        this.organizationRepository = organizationRepository;
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

        const response = newRegisterResponse(newUser, organization);

        return { data: response };
    }
}
