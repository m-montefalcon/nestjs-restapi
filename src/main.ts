import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationError, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });
    app.use(cookieParser());
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // strips unknown fields
            forbidNonWhitelisted: true, // throws error for extra fields
            transform: true, // transforms payloads (important for DTOs)
            exceptionFactory: (errors: ValidationError[]) => {
                const formattedErrors = errors.map((err) => ({
                    field: err.property,
                    messages: Object.values(err.constraints || {}),
                }));

                return new UnprocessableEntityException({
                    errors: formattedErrors,
                });
            },
        }),
    );
    const configService = app.get(ConfigService);
    app.enableCors({
        origin: configService.get<string>('FRONTEND_URL'),
        credentials: true,
    });
    app.setGlobalPrefix(configService.get<string>('GLOBAL_PREFIX') || 'v1/api');
    // Replace NestJS's default logger with Winston globally
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
