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

export type JobPageOpenedMessage = {
  type: "JOB_PAGE_OPENED";
  body: string;
  category: string;
  company: string;
  url: string;
};

export type SkillsParsedMessage = {
  type: "SKILLS_PARSED";
  skills: Array<[
    {
      normalizedText: string;
      text: string;
      type: string;
      familiarity: string;
      temperature: string;
      createdAt: string;
      updatedAt: string;
    },
    string
  ]>;
};

export type ReloadHighlightsMessage = {
  type: "RELOAD_HIGHLIGHTS";
};

export type JobListPageOpenedMessage = {
  type: "JOB_LIST_PAGE_OPENED";
  links: string[];
  url: string;
};

export type VisitedLinksParsedMessage = {
  type: "VISITED_LINKS_PARSED";
  links: string[];
};

export type SkillSaveTriggeredMessage = {
  type: "SKILL_SAVE_TRIGGERED"
  displayText: string;
  url: string;
}

export type SkillSavedMessage = {
  type: "SKILL_SAVED"
  displayText: string;
  url: string;
}

export type SkillEditTriggeredMessage = {
  type: "SKILL_EDIT_TRIGGERED";
  normalizedText: string;
  url?: string;
  skillType?: SkillType;
  familiarity?: Familiarity;
  temperature?: Temperature;
}

export type SkillEditedMessage = {
  type: "SKILL_EDITED";
  normalizedText: string;
  url: string;
  skillType?: SkillType;
  familiarity?: Familiarity;
  temperature?: Temperature;
}


export type SynonymAddTriggeredMessage = {
  type: "SYNONYM_ADD_TRIGGERED";
  synonymNormalizedText: string;
  normalizedText: string;
}

export type SynonymRemoveTriggeredMessage = {
  type: "SYNONYM_REMOVE_TRIGGERED";
  synonymText: string;
  synonymNormalizedText: string;
  normalizedText: string;
}

export type SynonymUpdatedMessage = {
  type: "SYNONYM_UPDATED";
}

export type ContentMessage = SkillsParsedMessage | ReloadHighlightsMessage | VisitedLinksParsedMessage |
  SkillSavedMessage | SkillEditedMessage | SynonymUpdatedMessage;
export type ContentMessageType = ContentMessage["type"];

export type ServiceWorkerMessage = JobPageOpenedMessage | JobListPageOpenedMessage |
  SkillSaveTriggeredMessage | SkillEditTriggeredMessage | SynonymAddTriggeredMessage | SynonymRemoveTriggeredMessage;
export type ServiceWorkerMessageType = ServiceWorkerMessage["type"];
