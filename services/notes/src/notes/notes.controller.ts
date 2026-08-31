import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { NotesService } from './notes.service.js';
import type { NoteDeleteInDto, NoteInDto, NoteTranslateInDto, NoteUpdateInDto } from '../dto/note.dto.js';

@Controller('note')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async store(@Body() { url, note_en }: NoteInDto) {
    return {
      id: this.notesService.create(url, note_en)
    }
  }

  @Put()
  async edit(@Body() { id, note_en }: NoteUpdateInDto) {
    return this.notesService.update(id, note_en)
  }

  @Put('uk')
  async translate(@Body() { id, note_uk }: NoteTranslateInDto) {
    return this.notesService.updateTranslation(id, note_uk)
  }

  @Get()
  async aggregate() {
    return this.notesService.aggregate();
  }

  @Delete()
  async delete(@Body() { id }: NoteDeleteInDto) {
    return this.notesService.delete(id);
  }

  @Delete('all')
  async deleteAll() {
    return this.notesService.deleteAll();
  }
}
