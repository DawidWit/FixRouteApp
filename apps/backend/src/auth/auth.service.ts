import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto, AuthResponse, VALIDATION_RULES } from '../types/auth';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { EmailService } from '../email/email.service';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private email: EmailService,
  ) {}

  async register(dto: AuthDto): Promise<AuthResponse> {
    // Input sanitization with proper typing
    const email: string = dto.email?.toLowerCase().trim() ?? '';
    const fullName: string = dto.fullName?.trim() ?? '';
    const password: string = dto.password ?? '';

    // Check for required fields
    if (!email || !fullName || !password) {
      throw new BadRequestException('register-all-fields-required');
    }

    // Email format validation using shared constants
    if (!VALIDATION_RULES.EMAIL.REGEX.test(email)) {
      throw new BadRequestException('register-invalid-email-format');
    }

    // Email length validation
    if (email.length > VALIDATION_RULES.EMAIL.MAX_LENGTH) {
      throw new BadRequestException('register-email-too-long');
    }

    // Full name validation using shared constants
    if (
      fullName.length < VALIDATION_RULES.FULL_NAME.MIN_LENGTH ||
      fullName.length > VALIDATION_RULES.FULL_NAME.MAX_LENGTH
    ) {
      throw new BadRequestException('register-fullname-length');
    }

    // Check for potentially malicious characters in full name
    if (!VALIDATION_RULES.FULL_NAME.REGEX.test(fullName)) {
      throw new BadRequestException('register-invalid-fullname');
    }

    // Password strength validation using shared constants
    if (password.length <= VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
      throw new BadRequestException('register-password-too-short');
    }

    if (password.length >= VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
      throw new BadRequestException('register-password-too-long');
    }

    if (!VALIDATION_RULES.PASSWORD.REGEX.test(password)) {
      throw new BadRequestException('register-password-strength');
    }

    try {
      // Check for existing user with proper typing
      const existingUser: { id: number } | null =
        await this.prisma.user.findUnique({
          where: { email },
          select: { id: true }, // Only select what we need
        });

      if (existingUser) {
        throw new ConflictException('register-email-in-use');
      }

      // Hash password with proper typing
      const saltRounds: number = 12;
      const hashedPassword: string = await bcrypt.hash(password, saltRounds);

      // Create user with proper typing for the select
      const user: {
        id: number;
        email: string;
        fullName: string;
        createdAt: Date;
      } = await this.prisma.user.create({
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

      // Generate and store verification code
      const code = await this.generateEmailVerificationCode(email);
      await this.email.sendValidationCode(email, code);
      // Return properly typed token response
      const authResponse: AuthResponse = await this.signToken(
        user.id,
        user.email,
        dto.rememberMe,
      );

      return {
        ...authResponse,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          createdAt: user.createdAt,
        },
      };
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('register-email-in-use');
      }

      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      console.error('Registration error:', error);

      // Generic error for unexpected issues
      throw new InternalServerErrorException('register-unexpected-error');
    }
  }

  /*async login(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new ForbiddenException('Invalid credentials');
    }

    return this.signToken(user.id, user.email);
  }*/

  async signToken(
    userId: number,
    email: string,
    rememberMe: boolean,
  ): Promise<AuthResponse> {
    const payload = { sub: userId, email };
    const token = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: rememberMe ? '720h' : '1h',
    });
    return { accessToken: token };
  }

  async checkToken(token: string): Promise<boolean> {
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log(payload);
      return true;
    } catch (error: any) {
      throw new UnauthorizedException();
    }
  }

  async generateEmailVerificationCode(email: String): Promise<string> {
    const code = crypto.randomBytes(4).toString('hex');
    await this.prisma.emailverification.create({
      email,
      otpCode: code,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });
    return code;
  }
}
