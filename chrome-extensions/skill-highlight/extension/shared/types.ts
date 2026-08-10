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
};
