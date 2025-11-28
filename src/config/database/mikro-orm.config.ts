import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { ConfigService } from '@nestjs/config';

// Funzione factory per ottenere la configurazione
// configService è opzionale: se c'è (NestJS), lo usa; altrimenti usa process.env (CLI)
export default (configService?: ConfigService) =>
  defineConfig({
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    // Se ConfigService esiste (NestJS), usalo; altrimenti usa process.env (CLI)
    dbName: configService
      ? configService.get<string>('database.name')
      : process.env.DATABASE_NAME || 'db-dev',
    host: configService
      ? configService.get<string>('database.host')
      : process.env.DATABASE_HOST || '127.0.0.1',
    port: configService
      ? configService.get<number>('database.port')
      : parseInt(process.env.DATABASE_PORT || '15432', 10),
    user: configService
      ? configService.get<string>('database.user')
      : process.env.DATABASE_USER || 'postgres',
    password: configService
      ? configService.get<string>('database.password')
      : process.env.DATABASE_PASSWORD || 'postgres',
    extensions: [Migrator],
    migrations: {
      tableName: 'migrations',
      path: 'src/config/database/migrations',
    },
  });
