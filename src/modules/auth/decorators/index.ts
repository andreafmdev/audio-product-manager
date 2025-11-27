// Re-export per compatibilità
export {
  PublicApi,
  AuthRoles,
  InjectAuthUser,
} from '../../../libs/decorator/auth.decorator';

// Opzionale: mappatura per Keycloak
// Quando usi Keycloak, puoi usare direttamente @Unprotected e @Roles
// dalla libreria nest-keycloak-connect nei controller
