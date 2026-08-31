import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { IssuesService } from './issues.service.js';
import type { IssueDtoIn } from '../dto/issue.dto.js';

@Controller('issue')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  async store(@Body() { url }: IssueDtoIn) {
    return this.issuesService.create(url)
  }

  @Get()
  async list() {
    return this.issuesService.list()
  }

  @Put()
  async update(@Body() { url }: IssueDtoIn) {
    return this.issuesService.update(url)
  }

  @Delete()
  async delete(@Body() { url }: IssueDtoIn) {
    return this.issuesService.delete(url)
  }
}
