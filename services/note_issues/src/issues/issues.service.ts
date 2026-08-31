import { Injectable } from '@nestjs/common';
import { Issue } from '@olyafilatova.github.io/db-notes';
import { IssuesStorageService } from './issues.storage.service.js';
import { IssueLinksFetchService } from './issue-links.fetch.service.js';


@Injectable()
export class IssuesService {
  constructor(
    private readonly issueLinksFetchService: IssueLinksFetchService,
    private readonly issuesStorageService: IssuesStorageService
  ) {}

  public async create(url: string) {
    // retrieve links:
    const links = await this.issueLinksFetchService.fetchGithubIssueLinks(url)
    // save to DB:
    await this.issuesStorageService.create(url, links)
  }

  public async list(): Promise<{issues: Issue[]}> {
    return {
      issues: await this.issuesStorageService.list()
    }
  }

  public async delete(url: string) {
    await this.issuesStorageService.delete(url)
  }

  public async update(url: string) {
    // retrieve links:
    const links = await this.issueLinksFetchService.fetchGithubIssueLinks(url)
    // update in DB:
    await this.issuesStorageService.update(url, links)
  }
}
