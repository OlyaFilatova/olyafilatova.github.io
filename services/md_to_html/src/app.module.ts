import { Module } from '@nestjs/common';
import { MarkdownModule } from './markdown/markdown.module.js';

@Module({
  imports: [MarkdownModule],
})
export class AppModule {}