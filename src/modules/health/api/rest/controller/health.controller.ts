import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';
import { PublicApi } from '../../../../../libs/decorator/auth.decorator';
import { AuthenticatedUser, Roles } from 'nest-keycloak-connect';
import { KeycloakRole } from '@/libs/api/api-role.enum';

@Controller({
  path: 'health',
})
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: MikroOrmHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    // private memory: MemoryHealthIndicator,
  ) {}

  @PublicApi()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('external-connectivity', 'https://google.com'),
      () => this.db.pingCheck('database'),
      () =>
        this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.8 }),
      //() => this.memory.checkHeap('memory', 750 * 1024 * 1024),
    ]);
  }
  @Get()
  @Roles({ roles: [KeycloakRole.ADMIN] })
  getUsers(@AuthenticatedUser() user) {
    return user;
  }
}
