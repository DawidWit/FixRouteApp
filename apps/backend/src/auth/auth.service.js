"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_types_1 = require("@shared_types/auth.types");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    prisma;
    jwt;
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(dto) {
        const email = dto.email?.toLowerCase().trim() ?? '';
        const fullName = dto.fullName?.trim() ?? '';
        const password = dto.password ?? '';
        if (!email || !fullName || !password) {
            throw new common_1.BadRequestException('register-all-fields-required');
        }
        if (!auth_types_1.VALIDATION_RULES.EMAIL.REGEX.test(email)) {
            throw new common_1.BadRequestException('register-invalid-email-format');
        }
        if (email.length > auth_types_1.VALIDATION_RULES.EMAIL.MAX_LENGTH) {
            throw new common_1.BadRequestException('register-email-too-long');
        }
        if (fullName.length < auth_types_1.VALIDATION_RULES.FULL_NAME.MIN_LENGTH ||
            fullName.length > auth_types_1.VALIDATION_RULES.FULL_NAME.MAX_LENGTH) {
            throw new common_1.BadRequestException('register-fullname-length');
        }
        if (!auth_types_1.VALIDATION_RULES.FULL_NAME.REGEX.test(fullName)) {
            throw new common_1.BadRequestException('register-invalid-fullname');
        }
        if (password.length < auth_types_1.VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
            throw new common_1.BadRequestException('register-password-too-short');
        }
        if (password.length > auth_types_1.VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
            throw new common_1.BadRequestException('register-password-too-long');
        }
        if (!auth_types_1.VALIDATION_RULES.PASSWORD.REGEX.test(password)) {
            throw new common_1.BadRequestException('register-password-strength');
        }
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: { email },
                select: { id: true },
            });
            if (existingUser) {
                throw new common_1.ConflictException('register-email-in-use');
            }
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = await this.prisma.user.create({
                data: {
                    email,
                    fullName,
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    createdAt: true,
                },
            });
            const authResponse = await this.signToken(user.id, user.email, dto.rememberMe);
            return {
                ...authResponse,
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    createdAt: user.createdAt,
                },
            };
        }
        catch (error) {
            if (error?.code === 'P2002') {
                throw new common_1.ConflictException('register-email-in-use');
            }
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            console.error('Registration error:', error);
            throw new common_1.InternalServerErrorException('register-unexpected-error');
        }
    }
    async signToken(userId, email, rememberMe) {
        const payload = { sub: userId, email };
        const token = await this.jwt.signAsync(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: rememberMe ? "720h" : '1h',
        });
        return { accessToken: token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map