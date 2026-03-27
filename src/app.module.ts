import { LoggerModule } from './logger/logger.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import * as Joi from 'joi';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/filters/logging.interceptor';
@Module({
    imports: [
        LoggerModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            validationSchema: Joi.object({
                MONGO_URI: Joi.string().required(),
                PORT: Joi.number().default(3000),
                GLOBAL_PREFIX: Joi.string().required(),
                JWT_SECRET: Joi.string().required(),
            }),
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getMongoConfig,
        }),
        AuthModule,
        UsersModule,
        ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class AppModule {}
