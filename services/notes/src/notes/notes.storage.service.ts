import { Injectable } from '@nestjs/common';
import { Note } from '@olyafilatova.github.io/db-notes'

@Injectable()
export class NotesStorageService {
  public async create(url: string, note_en: string) {
    const note = Note.create({
      url, note_en
    });
    await note.save()
    return note.id;
  }

  public async list(): Promise<Note[]> {
    return await Note.find()
  }

  public async delete(id: string) {
    const issue = await Note.findOneByOrFail({ id })
    return issue.remove();
  }

  public async deleteAll() {
    return Note.clear();
  }

  public async update(id: string, note_en: string) {
    const issue = await Note.findOneByOrFail({ id })
    issue.note_en = note_en
    return issue.save()
  }

  public async updateTranslation(id: string, note_uk: string) {
    const issue = await Note.findOneByOrFail({ id })
    issue.note_uk = note_uk
    return issue.save()
  }
}
