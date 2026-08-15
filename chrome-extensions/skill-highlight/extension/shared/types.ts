import { paths as jobSkillsPaths, components as jobSkillsComponents } from "./api/job-skills";
import { paths as skillsPaths } from "./api/skills";
import { paths as jobPostingsPaths } from "./api/job-postings";
import { paths as skillSynonymsPaths } from "./api/skill-synonyms";

export interface PageContext {
  category: string;
  company: string;
  url: string;
  descriptionEl: HTMLElement | null;
  extractedSkillTexts: string[];
  extractedSkillEls: HTMLElement[];
}

export type Familiarity = jobSkillsComponents["schemas"]["Familiarity"];
export type Temperature = jobSkillsComponents["schemas"]["Temperature"];
export type SkillType = jobSkillsComponents["schemas"]["SkillType"];

export type JobPostingData = jobPostingsPaths["/job-posting"]["post"]["requestBody"]["content"]["application/json"];
export type JobPostingResponse = jobPostingsPaths["/job-posting"]["post"]["responses"][200]["content"]["application/json"];
export type VisitedLinksRequest = jobPostingsPaths["/get-visited"]["post"]["requestBody"]["content"]["application/json"];
export type VisitedLinksResponse = jobPostingsPaths["/get-visited"]["post"]["responses"][200]["content"]["application/json"];

export type SkillFilters = jobSkillsPaths['/filter']['get']['parameters']['query'];
export type SkillsResponse = jobSkillsPaths['/filter']['get']['responses'][200]["content"]["application/json"];
export type SkillAggregate = SkillsResponse["skills"][number];
export type CategoriesResponse = jobSkillsPaths['/categories']['get']['responses'][200]["content"]["application/json"];
export type CreateJobSkillRequest = jobSkillsPaths['/job-skill']['post']['requestBody']['content']['application/json'];
export type CreateJobSkillResponse = jobSkillsPaths['/job-skill']['post']['responses'][200]["content"]["application/json"];


export type SkillTextsResponse = skillsPaths["/skill-texts"]["get"]["responses"][200]["content"]["application/json"];
export type SkillSaveRequest = skillsPaths["/skill"]["post"]["requestBody"]["content"]["application/json"];
export type SkillSaveResponse = skillsPaths["/skill"]["post"]["responses"][200]["content"]["application/json"];
export type SkillEditRequest = skillsPaths["/skill/{normalized_text}"]["put"]["requestBody"]["content"]["application/json"];
export type SkillEditResponse = skillsPaths["/skill/{normalized_text}"]["put"]["responses"][200]["content"]["application/json"];
export type SynonymCreateRequest = skillsPaths["/synonym"]["post"]["requestBody"]["content"]["application/json"];
export type SynonymCreateResponse = skillsPaths["/synonym"]["post"]["responses"][200]["content"]["application/json"];
export type SynonymRemoveRequest = skillsPaths["/synonym"]["delete"]["requestBody"]["content"]["application/json"];
export type SynonymRemoveResponse = skillsPaths["/synonym"]["delete"]["responses"][200]["content"]["application/json"];
export type SuggestSkillSynonymsResponse = skillSynonymsPaths["/"]["get"]["responses"][200]["content"]["application/json"];
export type IgnoreSuggestedSkillSynonymsRequest = skillSynonymsPaths["/ignore/{id}"]["post"]["parameters"]["path"];

export type JobPageOpenedMessage = {
  type: "JOB_PAGE_OPENED";
  message: JobPostingData
};

export type SkillsParsedMessage = {
  type: "SKILLS_PARSED";
  message: JobPostingResponse;
};

export type ReloadHighlightsMessage = {
  type: "RELOAD_HIGHLIGHTS";
  message: undefined;
};

export type JobListPageOpenedMessage = {
  type: "JOB_LIST_PAGE_OPENED";
  message: VisitedLinksRequest & {
    url: string;
  }
};

export type VisitedLinksParsedMessage = {
  type: "VISITED_LINKS_PARSED";
  message: VisitedLinksResponse;
};

export type SkillSaveTriggeredMessage = {
  type: "SKILL_SAVE_TRIGGERED"
  message: {
    displayText: string;
    url: string;
  }
}

export type SkillSavedMessage = {
  type: "SKILL_SAVED"
  message: {
    displayText: string;
    url: string;
  }
}

export type SkillEditTriggeredMessage = {
  type: "SKILL_EDIT_TRIGGERED";
  message: SkillEditRequest & {
    normalizedText: string;
    url?: string;
  }
}

export type SkillEditedMessage = {
  type: "SKILL_EDITED";
  message: SkillEditRequest & {
    url?: string;
  }
}


export type SynonymAddTriggeredMessage = {
  type: "SYNONYM_ADD_TRIGGERED";
  message: SynonymCreateRequest;
}

export type SynonymRemoveTriggeredMessage = {
  type: "SYNONYM_REMOVE_TRIGGERED";
  message: SynonymRemoveRequest;
}

export type SynonymUpdatedMessage = {
  type: "SYNONYM_UPDATED";
  message: undefined;
}

export type ContentMessage = SkillsParsedMessage | ReloadHighlightsMessage | VisitedLinksParsedMessage |
  SkillSavedMessage | SkillEditedMessage | SynonymUpdatedMessage;
export type ContentMessageType = ContentMessage["type"];

export type ServiceWorkerMessage = JobPageOpenedMessage | JobListPageOpenedMessage |
  SkillSaveTriggeredMessage | SkillEditTriggeredMessage | SynonymAddTriggeredMessage | SynonymRemoveTriggeredMessage;
export type ServiceWorkerMessageType = ServiceWorkerMessage["type"];
