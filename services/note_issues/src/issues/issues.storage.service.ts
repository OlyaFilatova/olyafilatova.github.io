import { Injectable } from '@nestjs/common';
import { Issue } from '@olyafilatova.github.io/db-notes';


@Injectable()
export class IssuesStorageService {
  public async create(url: string, links: Array<[string, string]>) {
    await Issue.create({
      url, links
    }).save()
  }

  public async list(): Promise<Issue[]> {
    return await Issue.find()
  }

  public async delete(url: string) {
    const issue = await Issue.findOneByOrFail({ url })
    await issue.remove();
  }

  public async update(url: string, links: Array<[string, string]>) {
    const issue = await Issue.findOneByOrFail({ url })
    issue.links = links
    issue.save()
  }
}
