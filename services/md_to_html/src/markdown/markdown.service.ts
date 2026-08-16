import { Injectable } from '@nestjs/common';
import MarkdownIt from 'markdown-it';

@Injectable()
export class MarkdownService {
  private readonly md = new MarkdownIt({
    html: true,
    linkify: true,
    breaks: true,
    typographer: true,
    xhtmlOut: true
  });

  convert(markdown: string): string {
    return this.md.render(markdown);
  }
}
