// auth/auth.controller.ts
import { Body, Controller, Post, UseGuards, HttpCode, HttpStatus, Res, Get } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private config: ConfigService,
    ) {}

    @Post('register')
    async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const { token, user } = await this.authService.register(dto);
        this.setTokenCookie(res, token);
        return { user }; // Never send the token in the body
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { token, user } = await this.authService.login(dto);
        this.setTokenCookie(res, token);
        return { user };
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token', this.cookieOptions());
        return this.authService.logout();
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(@CurrentUser() user: { id: string; email: string; role: string }) {
        return user; // Useful for Next.js to rehydrate session on page load
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────

    private setTokenCookie(res: Response, token: string) {
        res.cookie('access_token', token, this.cookieOptions());
    }

    private cookieOptions() {
        const isProd = this.config.get('NODE_ENV') === 'production';
        return {
            httpOnly: true, // JS cannot read this cookie — blocks XSS token theft
            secure: isProd, // HTTPS only in production
            sameSite: 'lax' as const, // Protects against CSRF while allowing normal navigation
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            path: '/',
        };
    }
}
