import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
}

export interface AuthConfig {
  provider: 'keycloak' | 'supabase';
  keycloak?: {
    authServerUrl: string;
    realm: string;
    clientId: string;
    clientSecret: string;
  };
  supabase?: {
    url: string;
    anonKey: string;
    jwtSecret: string;
  };
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  environment: string;
}

// Registra le configurazioni con namespace
export default registerAs(
  'app',
  (): AppConfig => ({
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    environment: process.env.ENVIRONMENT || process.env.NODE_ENV || 'local',
  }),
);

export const databaseConfig = registerAs(
  'database',
  (): DatabaseConfig => ({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port: parseInt(process.env.DATABASE_PORT || '15432', 10),
    name: process.env.DATABASE_NAME || 'db-dev',
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
  }),
);

export const authConfig = registerAs('auth', (): AuthConfig => {
  const provider = (process.env.AUTH_PROVIDER || 'keycloak') as
    | 'keycloak'
    | 'supabase';

  return {
    provider,
    keycloak: {
      authServerUrl: process.env.KEYCLOAK_AUTH_SERVER_URL || '',
      realm: process.env.KEYCLOAK_REALM || '',
      clientId: process.env.KEYCLOAK_CLIENT_ID || '',
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
    },
    supabase: {
      url: process.env.SUPABASE_URL || '',
      anonKey: process.env.SUPABASE_ANON_KEY || '',
      jwtSecret: process.env.SUPABASE_JWT_SECRET || '',
    },
  };
});
