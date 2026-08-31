import { Module } from '@nestjs/common';
import { NotesModule } from './notes/notes.module.js';
import { HealthModule } from './health/health.module.js';

@Module({
  imports: [NotesModule, HealthModule],
})
export class AppModule {}
