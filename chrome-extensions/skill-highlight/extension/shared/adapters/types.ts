export type PageType = 'job' | 'jobs-list';

export interface WebsiteAdapter {
  isCurrent(url: string): boolean;

  identifyPageType(url: string): PageType | undefined;

  getCompany(): string;

  getDescriptionEl(): HTMLElement | null;

  getPageCategory(): string;

  getLinks(): string[];

  stylizeVisitedLinks(visitedLinks: string[]): void;

  addJobListPageChangedObserver(observer: () => void): void;

  setupJobListPageChangedObserver(): void;
}
