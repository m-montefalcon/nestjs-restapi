import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getMongoConfig = (configService: ConfigService): MongooseModuleOptions => ({
    uri: configService.get<string>('MONGO_URI'),

    // optional mongoose options:
    // connectTimeoutMS: 10000,
    // serverSelectionTimeoutMS: 5000,
});
