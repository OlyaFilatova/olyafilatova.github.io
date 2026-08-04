import { IsString } from 'class-validator';

export class ConvertMarkdownDto {
  @IsString()
  markdown: string = '';
}
