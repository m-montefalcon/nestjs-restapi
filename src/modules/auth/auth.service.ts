// auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const user = await this.usersService.createWithHashedPassword(dto);
        const token = this.signToken(user._id.toString(), user.email, user.role);
        return { token, user: { id: user._id, email: user.email, role: user.role } };
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);

        if (!user || !(await bcrypt.compare(dto.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.signToken(user._id.toString(), user.email, user.role);
        return { token, user: { id: user._id, email: user.email, role: user.role } };
    }

    logout() {
        // Cookie is cleared by the controller
        return { message: 'Logged out successfully' };
    }

    private signToken(sub: string, email: string, role: string): string {
        return this.jwtService.sign({ sub, email, role });
    }
}
