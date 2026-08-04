import { Body, Controller, Get, Post } from '@nestjs/common';
import { MarkdownService } from './markdown.service.js';
import type { ConvertMarkdownDto } from '../dto/convert-markdown.dto.js';

@Controller('markdown')
export class MarkdownController {
  constructor(private readonly markdownService: MarkdownService) {}

  @Get('health')
  health() {
    return {
      status: "ok",
    };
  }

  @Post('convert')
  convert(@Body() dto: ConvertMarkdownDto) {
    return {
      html: this.markdownService.convert(dto.markdown),
    };
  }
}
