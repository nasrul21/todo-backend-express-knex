import { createSecretKey } from 'crypto';
import jwt from 'jsonwebtoken';
import OrganizationRepository from '../organization/organizationRepository';
import UserRepository from '../user/userRepository';
import {
    LoginRequest,
    LoginResponse,
    newRegisterResponse,
    RegisterRequest,
    RegisterResponse,
} from './authModel';
import UserOrganizationRepository from '../user_organization/userOrganizationRepository';
import { BaseResponse } from '../common/base_response';
import { UserOrganizationEnum } from '../user_organization/userOrganizationModel';

const bcrypt = require('bcrypt');
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
    ): Promise<BaseResponse<RegisterResponse>> {
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
            role: UserOrganizationEnum.Admin,
        });

        const response = newRegisterResponse(newUser, organization);

        return { data: response };
    }

    async login(params: LoginRequest): Promise<BaseResponse<LoginResponse>> {
        const users = await this.userRepository.findByEmail(params.email);
        if (users.length == 0) {
            return { error: 'User is not found' };
        }

        const user = users[0];

        const isValidPassword = await bcrypt.compare(
            params.password,
            user.password_hash
        );
        if (!isValidPassword) {
            return { error: 'Invalid login credentials' };
        }

        const secretKey = process.env.JWT_SECRET!;

        const options: jwt.SignOptions = {
            algorithm: 'HS256',
            expiresIn: '1h',
        };

        const token = jwt.sign(
            {
                id: user.id!,
                email: user.email,
            },
            secretKey,
            options
        );

        return {
            data: {
                access_token: token,
                token_type: 'Bearer',
            },
        };
    }
}
