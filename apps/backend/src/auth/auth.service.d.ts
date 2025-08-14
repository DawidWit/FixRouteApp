import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, AuthResponse } from '@shared_types/auth.types';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private prisma;
    private jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: AuthDto): Promise<AuthResponse>;
    signToken(userId: number, email: string, rememberMe: boolean): Promise<AuthResponse>;
}
