import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service.js';
import { IssuesController } from './issues.controller.js';
import { IssuesStorageService } from './issues.storage.service.js';
import { IssueLinksFetchService } from './issue-links.fetch.service.js';

@Module({
  providers: [IssuesService, IssuesStorageService, IssueLinksFetchService],
  controllers: [IssuesController],
  exports: [IssuesService]
})
export class IssuesModule {}

