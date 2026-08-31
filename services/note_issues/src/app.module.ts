import { Module } from '@nestjs/common';
import { IssuesModule } from './issues/issues.module.js';
import { HealthModule } from './health/health.module.js';

@Module({
  imports: [IssuesModule, HealthModule],
})
export class AppModule {}
