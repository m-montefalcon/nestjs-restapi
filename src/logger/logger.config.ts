import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const winstonConfig: winston.LoggerOptions = {
    level: process.env.LOG_LEVEL || 'info',
    transports: [
        // ── Console: pretty-printed, colorized ───────────────────────────
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                nestWinstonModuleUtilities.format.nestLike('MyApp', {
                    prettyPrint: true,
                    colors: true,
                }),
            ),
        }),

        // ── File: error-level only, JSON, daily rotation ─────────────────
        new winston.transports.DailyRotateFile({
            level: 'error',
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d', // keep 14 days of logs
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json(),
            ),
        }),

        // ── File: all levels combined ─────────────────────────────────────
        new winston.transports.DailyRotateFile({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
    ],
};
