import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
  PolicyEnforcementMode,
  TokenValidation,
} from 'nest-keycloak-connect';

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createKeycloakConnectOptions(): KeycloakConnectOptions {
    const authServerUrl = this.configService.get<string>(
      'KEYCLOAK_AUTH_SERVER_URL',
    );
    const realm = this.configService.get<string>('KEYCLOAK_REALM');
    const clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID');

    if (!authServerUrl || !realm || !clientId) {
      throw new Error('Missing required Keycloak configuration');
    }

    return {
      authServerUrl,
      realm,
      clientId,
      secret: this.configService.get<string>('KEYCLOAK_CLIENT_SECRET') || '',
      policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.ONLINE,
    };
  }
}
