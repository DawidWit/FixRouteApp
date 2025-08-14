import { AuthService } from './auth.service';
import { AuthDto } from '@shared_types/auth.types';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: AuthDto): Promise<AuthResponse>;
    login(dto: AuthDto): boolean;
}
