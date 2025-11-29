import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  ENVIRONMENT: Joi.string().valid('local', 'qual', 'reg', 'prod').optional(),
  PORT: Joi.number().default(3000),

  // Database (sempre richiesto)
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),

  // Auth Provider (opzionale - nessun default)
  AUTH_PROVIDER: Joi.string()
    .valid('keycloak', 'supabase')
    .optional()
    .allow(null, ''),

  // Keycloak (completamente opzionale)
  KEYCLOAK_AUTH_SERVER_URL: Joi.string().optional().allow(''),
  KEYCLOAK_REALM: Joi.string().optional().allow(''),
  KEYCLOAK_CLIENT_ID: Joi.string().optional().allow(''),
  KEYCLOAK_CLIENT_SECRET: Joi.string().optional().allow(''),

  // Supabase (completamente opzionale)
  SUPABASE_URL: Joi.string().optional().allow(''),
  SUPABASE_ANON_KEY: Joi.string().optional().allow(''),
  SUPABASE_JWT_SECRET: Joi.string().optional().allow(''),
});
