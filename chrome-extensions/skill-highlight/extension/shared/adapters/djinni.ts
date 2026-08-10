import { getLinks, stylizeVisitedLinks } from "../link-tags";
import { normalizeSkillText, splitSkillList } from "../skill";
import { PageType, WebsiteAdapter } from "./types";

const DJINNI_JOB_URL_PATTERN = /^https:\/\/djinni\.co\/jobs\/[^?]+.+$/;
const DJINNI_JOB_LIST_URL_PATTERN = /^https:\/\/djinni\.co\/jobs(\/?$|\/?\?)/;
const DJINNI_DASHBOARD_PATTERN = /^https:\/\/djinni\.co\/my\/dashboard/;

export class DjinniAdapter implements WebsiteAdapter {
  isCurrent(url: string): boolean {
    return this.identifyPageType(url) !== undefined;
  }

  identifyPageType(url: string): PageType | undefined {
    if (DJINNI_JOB_URL_PATTERN.test(url)) {
      return 'job';
    }
    if (
      DJINNI_JOB_LIST_URL_PATTERN.test(url) ||
      DJINNI_DASHBOARD_PATTERN.test(url)
    ) {
      return 'jobs-list'
    }
    return undefined;
  }

  getCompany() {
    return document.querySelector("h1 + div a")?.textContent?.trim() || "Unknown";
  }

  getDescriptionEl() {
    return document.querySelector<HTMLElement>(".job-post__description");
  }

  getPageCategory(): string {
    const breadcrumbItem = document.querySelector("ol.breadcrumb li:last-child");
    const breadcrumbLink = breadcrumbItem?.querySelector<HTMLAnchorElement>("a");
    const href = breadcrumbLink?.getAttribute("href");
    const primaryKeyword = href ? this.getPrimaryKeywordFromHref(href) : "";

    return primaryKeyword || breadcrumbItem?.textContent?.trim() || "Unknown";
  }

  getLinks() {
    return getLinks('.job_item__header-link');
  }

  stylizeVisitedLinks(visitedLinks: string[]) {
    stylizeVisitedLinks('.job_item__header-link', visitedLinks);
  }

  private getPrimaryKeywordFromHref(href: string): string {
    try {
      const url = new URL(href, window.location.origin);
      return url.searchParams.get("primary_keyword")?.trim() || "";
    } catch {
      return "";
    }
  }

  private getExtractedSkillElements(): HTMLElement[] {
    return [
      ...document.querySelectorAll<HTMLElement>(
        ".job-post__description + h2 + .mb-3 td:first-child, a[aria-controls=\"more_skills_exp\"] + div td:first-child"
      ),
      ...this.getTagSkillElements()
    ];
  }

  private getExtractedSkillTexts(): string[] {
    const skillTextsByNormalizedText = new Map<string, string>();

    for (const text of this.getExtractedSkillElements().flatMap((element) => splitSkillList(element.textContent ?? ""))) {
      const normalizedText = normalizeSkillText(text);
      if (normalizedText && !skillTextsByNormalizedText.has(normalizedText)) {
        skillTextsByNormalizedText.set(normalizedText, text);
      }
    }

    return [...skillTextsByNormalizedText.values()];
  }

  private getTagSkillElements(): HTMLElement[] {
    const elements: HTMLElement[] = [];
    for (const icon of document.querySelectorAll<HTMLElement>("div > .bi-tags")) {
      const label = icon.closest("div");
      const skills = label?.nextElementSibling;
      if (skills instanceof HTMLElement && skills.tagName.toLowerCase() === "div") {
        elements.push(skills);
      }
    }
    return elements;
  }
}
