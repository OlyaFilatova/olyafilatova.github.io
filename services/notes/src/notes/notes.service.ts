import { Injectable } from '@nestjs/common';
import { Note } from '@olyafilatova.github.io/db-notes'
import { NotesOutDto } from '../dto/note.dto.js';
import { NotesStorageService } from './notes.storage.service.js';

@Injectable()
export class NotesService {
  constructor(private readonly noteStorageService: NotesStorageService) {}

  public async create(url: string, note_en: string) {
    return this.noteStorageService.create(url, note_en)
  }

  public async aggregate(): Promise<{
    pages: Record<string, NotesOutDto>
  }> {
    const notes = (await Note.find()).toReversed()
    type ReduceType = Record<string, {
        url: string;
        notes: typeof notes;
      }>;
    return {
      pages: notes.reduce<ReduceType>((groups, note) => {
        (groups[note.url] ??= {
          url: note.url,
          // lastUpdated: note.updated_at
          notes: [] as typeof notes
        }).notes.push(note)
        return groups
      }, {})
    }
  }

  public async delete(id: string) {
    return this.noteStorageService.delete(id)
  }

  public async deleteAll() {
    return this.noteStorageService.deleteAll()
  }

  public async update(id: string, note_en: string) {
    return this.noteStorageService.update(id, note_en)
  }

  public async updateTranslation(id: string, note_uk: string) {
    return this.noteStorageService.updateTranslation(id, note_uk)
  }
}
