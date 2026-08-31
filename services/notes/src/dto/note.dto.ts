import { IsString, IsBoolean, IsArray } from 'class-validator';

export class NoteInDto {
  @IsString()
  url!: string;

  @IsString()
  note_en!: string;
}

export class NoteUpdateInDto {
  @IsString()
  id!: string;

  @IsString()
  note_en!: string;
}

export class NoteTranslateInDto {
  @IsString()
  id!: string;

  @IsString()
  note_uk!: string;
}

export class NoteDeleteInDto {
  @IsString()
  id!: string;
}

class NoteOutDto {
  @IsString()
  id!: string;

  @IsString()
  url!: string;

  @IsString()
  note_en!: string;

  @IsString()
  note_uk?: string | null;

  @IsBoolean()
  uk_approved!: boolean;

  @IsBoolean()
  visible!: boolean;
}

export class NotesOutDto {
  @IsString()
  url!: string;

  @IsArray()
  notes!: NoteOutDto[];
}