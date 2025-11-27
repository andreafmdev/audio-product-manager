import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  ENVIRONMENT: Joi.string().valid('local', 'qual', 'reg', 'prod').optional(),
  PORT: Joi.number().default(3000),

  // Database
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),

  // Auth Provider
  AUTH_PROVIDER: Joi.string().valid('keycloak', 'supabase').default('keycloak'),

  // Keycloak (required if AUTH_PROVIDER=keycloak)
  KEYCLOAK_AUTH_SERVER_URL: Joi.string().when('AUTH_PROVIDER', {
    is: 'keycloak',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  KEYCLOAK_REALM: Joi.string().when('AUTH_PROVIDER', {
    is: 'keycloak',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  KEYCLOAK_CLIENT_ID: Joi.string().when('AUTH_PROVIDER', {
    is: 'keycloak',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  KEYCLOAK_CLIENT_SECRET: Joi.string().when('AUTH_PROVIDER', {
    is: 'keycloak',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  // Supabase (required if AUTH_PROVIDER=supabase)
  SUPABASE_URL: Joi.string().when('AUTH_PROVIDER', {
    is: 'supabase',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  SUPABASE_ANON_KEY: Joi.string().when('AUTH_PROVIDER', {
    is: 'supabase',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  SUPABASE_JWT_SECRET: Joi.string().when('AUTH_PROVIDER', {
    is: 'supabase',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});
