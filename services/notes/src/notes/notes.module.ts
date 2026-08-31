import { Module } from '@nestjs/common';
import { NotesService } from './notes.service.js';
import { NotesController } from './notes.controller.js';
import { NotesStorageService } from './notes.storage.service.js';

@Module({
  providers: [NotesService, NotesStorageService],
  controllers: [NotesController],
  exports: [NotesService]
})
export class NotesModule {}

