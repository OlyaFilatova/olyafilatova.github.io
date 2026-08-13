import { getLinks, stylizeVisitedLinks } from "../link-tags";
import { PageType, WebsiteAdapter } from "./types";

const DOU_JOB_URL_PATTERN = /^https:\/\/jobs\.dou\.ua\/companies\/.+\/vacancies\/[^?]+.+$/;
const DOU_JOB_LIST_URL_PATTERN = /^https:\/\/jobs\.dou\.ua\/vacancies\/\?.+/;

export class DouAdapter implements WebsiteAdapter {
  private jobListPageChangedObservers: Array<() => void> = [];

  isCurrent(url: string): boolean {
    return this.identifyPageType(url) !== undefined;
  }

  identifyPageType(url: string): PageType | undefined {
    if (DOU_JOB_URL_PATTERN.test(url)) {
      return 'job';
    }
    if (DOU_JOB_LIST_URL_PATTERN.test(url)) {
      return 'jobs-list'
    }
    return undefined;
  }

  getCompany() {
    return document.querySelector(".b-compinfo .l-n a:first-child")?.textContent?.trim() || "Unknown";
  }

  getDescriptionEl() {
    return document.querySelector<HTMLElement>(".vacancy-section");
  }

  getPageCategory(): string {
    const breadcrumbItem = document.querySelector(".breadcrumbs a:nth-last-child(2)") || document.querySelector(".breadcrumbs a:last-child");
    const href = breadcrumbItem?.getAttribute("href");
    const primaryKeyword = href ? this.getPrimaryKeywordFromHref(href) : "";

    return primaryKeyword || breadcrumbItem?.textContent?.trim() || "Unknown";
  }

  getLinks() {
    return getLinks('.l-vacancy a.vt');
  }

  stylizeVisitedLinks(visitedLinks: string[]) {
    stylizeVisitedLinks('.l-vacancy a.vt', visitedLinks);
  }

  addJobListPageChangedObserver(observer: () => void) {
    this.jobListPageChangedObservers.push(observer);
  }

  setupJobListPageChangedObserver() {
    (new MutationObserver(() => this.triggerJobListPageChangedEvent()))
      .observe(document.querySelector("ul.lt")!, {
        childList: true
      });
  }

  private triggerJobListPageChangedEvent() {
    this.jobListPageChangedObservers.forEach(observer => observer());
  }

  private getPrimaryKeywordFromHref(href: string): string {
    try {
      const url = new URL(href, window.location.origin);
      return url.searchParams.get("category")?.trim() || "";
    } catch {
      return "";
    }
  }
}
