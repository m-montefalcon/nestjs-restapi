import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationError, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    useContainer(app.select(AppModule), { fallbackOnErrors: true });

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
    await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
