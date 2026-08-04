import { Module } from '@nestjs/common';
import { MarkdownService } from './markdown.service.js';
import { MarkdownController } from './markdown.controller.js';

@Module({
  providers: [MarkdownService],
  controllers: [MarkdownController],
  exports: [MarkdownService],
})
export class MarkdownModule {}
