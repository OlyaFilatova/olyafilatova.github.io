import { Injectable } from '@nestjs/common';


@Injectable()
export class IssueLinksFetchService {
  public async fetchGithubIssueLinks(url: string) {
    const queryParams = new URLSearchParams({
      url
    });
    const response = await fetch(`${process.env.SERVICE_ISSUE_LINKS}/issue-links?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });
    return (await response.json() as {
      links: Array<[string, string]>
    })["links"];
  }
}
