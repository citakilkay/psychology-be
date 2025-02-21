import * as dotenv from 'dotenv'
dotenv.config()

type DBConfig = {
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    AUTO_LOAD_ENTITIES: boolean;
    SYNCHRONIZE: boolean;
    SSL_REJECT_UNAUTHORIZED: boolean;
}
type JWTConfig = {
    JWT_SECRET: string;
}
type ServerConfig = {
    PORT: number;
}

type Config = {
    db: DBConfig;
    jwt: JWTConfig;
    server: ServerConfig;
};

export function getConfig(): Config {
    return {
        db: {
            DB_HOST: mustGetEnv('DB_HOST'),
            DB_PORT: mustGetIntEnv('DB_PORT'),
            DB_USERNAME: mustGetEnv('DB_USERNAME'),
            DB_PASSWORD: mustGetEnv('DB_PASSWORD'),
            DB_NAME: mustGetEnv('DB_NAME'),
            AUTO_LOAD_ENTITIES: getBoolEnv('AUTO_LOAD_ENTITIES', true),
            SYNCHRONIZE: getBoolEnv('SYNCHRONIZE', true),
            SSL_REJECT_UNAUTHORIZED: getBoolEnv('SSL_REJECT_UNAUTHORIZED', false),
        },
        jwt: {
            JWT_SECRET: mustGetEnv('JWT_SECRET'),
        },
        server: {
            PORT: getIntEnv('PORT', 3000),
        }
    }
}

const mustGetEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set.`);
    }
    return value;
}

const mustGetIntEnv = (key: string): number => {
    const value = mustGetEnv(key);
    const intValue = parseInt(value);
    if (isNaN(intValue)) {
        throw new Error(`Environment variable ${key} is not a valid integer.`);
    }
    return intValue;
}

const getEnv = (name: string, fallback?: string): string => {
    return process.env[name] || fallback;
}

const getIntEnv = (name: string, fallback?: number): number => {
    return parseInt(getEnv(name, fallback.toString()));
}

const getBoolEnv = (name: string, fallback?: boolean): boolean => {
    return getEnv(name, fallback.toString()) === 'true';
}


