export type Familiarity = "know-in-depth" | "study" | "actively-using" | "know-a-bit" | "unknown";
export type Temperature = "interested" | "meh" | "avoid!";
export type SkillType = "Application" | "Approach" | "Non-skill";

export interface PageContext {
  category: string;
  company: string;
  url: string;
  descriptionEl: HTMLElement | null;
  extractedSkillTexts: string[];
  extractedSkillEls: HTMLElement[];
}

export interface JobPostingData {
  url: string;
  body: string;
  category: string;
  company: string;
}

export interface SkillFilters {
  currentPage: number;
  pageSize: number;
  search: string;
  category: string;
  type: SkillType;
  familiarity: Familiarity; 
  temperature: Temperature;
  sort: string;
  jobUrl?: string;
}

export interface SkillAggregate {
  normalizedText: string;
  displayText: string;
  familiarity: Familiarity;
  temperature: Temperature;
  type: SkillType;
  normalizedSynonyms: string[];
  synonymTexts: string[];
  categories: string[];
  mentions: string[];
  companyCount: number;
  companies: string[];
}

export type ExtensionMessage = {
  type: "JOB_PAGE_OPENED";
  body: string;
  category: string;
  company: string;
  url: string;
} | {
  type: "SKILLS_PARSED";
  skills: Array<[{
    normalized_text: string;
    text: string
    type: string;
    familiarity: string;
    temperature: string;
    created_at: string;
    updated_at: string;
  }, string]> 
} | {
  type: "RELOAD_HIGHLIGHTS"
};
