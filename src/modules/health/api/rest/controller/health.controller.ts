import { Controller, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';
import { Unprotected } from 'nest-keycloak-connect';
import { platform } from 'os';

@Controller({
  path: 'health',
})
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private db: MikroOrmHealthIndicator,
    private readonly disk: DiskHealthIndicator,
  ) {}

  @Unprotected()
  @Get()
  @HealthCheck()
  check() {
    // Determina il percorso root in base al sistema operativo
    const rootPath =
      platform() === 'win32' ? process.cwd().split('\\')[0] + '\\' : '/';

    return this.health.check([
      () => this.http.pingCheck('external-connectivity', 'https://google.com'),
      () => this.db.pingCheck('database'),
      () =>
        this.disk.checkStorage('storage', {
          path: rootPath,
          thresholdPercent: 0.8,
        }),
    ]);
  }
}
