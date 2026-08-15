/* eslint-disable @typescript-eslint/no-explicit-any */
import { normalizeSkillText } from "./skill";
import { CategoriesResponse, CreateJobSkillRequest, Familiarity, IgnoreSuggestedSkillSynonymsRequest, JobPostingData, JobPostingResponse, SkillAggregate, SkillEditTriggeredMessage, SkillFilters, SkillSaveResponse, SkillSaveTriggeredMessage, SkillsResponse, SkillTextsResponse, SkillType, SuggestSkillSynonymsResponse, SynonymAddTriggeredMessage, SynonymRemoveTriggeredMessage, Temperature, VisitedLinksRequest, VisitedLinksResponse } from "./types";


interface SkillRepository {
  getJobPostingSkills(jobPostingData: JobPostingData): Promise<JobPostingResponse["skills"]>;
  getSkills(skillFilters: SkillFilters): Promise<SkillAggregate[]>;
  getCategories(): Promise<string[]>;
  getVisitedLinks(links: string[]): Promise<string[]>;
  createSkill(message: SkillSaveTriggeredMessage["message"]): Promise<{
    normalizedText: string;
    displayText: string;
    familiarity: Familiarity;
    temperature: Temperature;
    type: SkillType;
  }>;
  getSkillTexts(): Promise<Array<{
    displayText: string;
    normalizedText: string;
  }>>;
  editSkill(message: SkillEditTriggeredMessage["message"]): Promise<void>;
  addSynonym(message: SynonymAddTriggeredMessage["message"]): Promise<void>;
  removeSynonym(message: SynonymRemoveTriggeredMessage["message"]): Promise<void>;
  suggestSkillSynonyms(): Promise<SuggestSkillSynonymsResponse>;
  ignoreSuggestedGroup({ id }: IgnoreSuggestedSkillSynonymsRequest): Promise<void>;
}

type StorageResponse<T = unknown> = { ok: true; result: T } | { ok: false; error: string };

const STORAGE_REQUEST_TYPE = "SKILL_STORAGE_REQUEST";

type StorageMethod = keyof SkillRepository;
type StorageRequest = {
  type: typeof STORAGE_REQUEST_TYPE;
  method: StorageMethod;
  args: unknown[];
};

class ChromeSkillRepository implements SkillRepository {
  async getJobPostingSkills(jobPostingData: JobPostingData): Promise<JobPostingResponse["skills"]> {
    const response = await fetch(`${API_URL}/api/job-postings/job-posting`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobPostingData)
    });

    return (await response.json())["skills"];
  }

  async getCategories(): Promise<CategoriesResponse> {
    const response = await fetch(`${API_URL}/api/job-skills/categories`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    return (await response.json());
  }

  async getVisitedLinks(links: VisitedLinksRequest["links"]): Promise<VisitedLinksResponse["links"]> {
    console.log(links)
    const response = await fetch(`${API_URL}/api/job-postings/get-visited`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ links })
    });

    return (await response.json())["links"];
  }

  async getSkills(skillFilters: SkillFilters): Promise<SkillsResponse["skills"]> {
    const params = new URLSearchParams();
    if (skillFilters) {
      Object.entries(skillFilters)
        .filter((entry): entry is [string, string | number] => !!entry[1])
        .forEach(([key, value]) => params.append(key, value.toString()));
    }

    const response = await fetch(`${API_URL}/api/job-skills/filter?${params.toString()}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    const result = await response.json();

    return [result["totalRows"], result["skills"]];
  }

  async getSkillTexts(): Promise<SkillTextsResponse["texts"]> {
    const response = await fetch(`${API_URL}/api/skills/skill-texts`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    const result = await response.json();

    return result["texts"];
  }

  async suggestSkillSynonyms(): Promise<SuggestSkillSynonymsResponse> {
    const response = await fetch(`${API_URL}/api/skill-synonyms`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    return await response.json();
  }

  async ignoreSuggestedGroup({ id }: IgnoreSuggestedSkillSynonymsRequest): Promise<void> {
    await fetch(`${API_URL}/api/skill-synonyms/ignore/${id}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });
  }

  async createSkill(skillData: SkillSaveTriggeredMessage["message"]): Promise<SkillSaveResponse> {
    const skillsResponse = await fetch(`${API_URL}/api/skills/skill`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        displayText: skillData.displayText,
        normalizedText: normalizeSkillText(skillData.displayText)
      })
    });
    const skillSaveResult: SkillSaveResponse = await skillsResponse.json();
    const normalizedText = skillSaveResult["normalizedText"];

    const jobSkillsResponse = await fetch(`${API_URL}/api/job-skills/job-skill`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        normalizedText: normalizedText,
        url: skillData.url
      } satisfies CreateJobSkillRequest)
    });

    await jobSkillsResponse.json();

    return skillSaveResult;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async editSkill({ url, normalizedText, ...skillData }: SkillEditTriggeredMessage["message"]): Promise<void> {
    await fetch(`${API_URL}/api/skills/skill/${normalizedText}`, {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skillData)
    });
  }

  async addSynonym(message: SynonymAddTriggeredMessage["message"]): Promise<void> {
    await fetch(`${API_URL}/api/skills/synonym`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message)
    });
  }

  async removeSynonym(message: SynonymRemoveTriggeredMessage["message"]): Promise<void> {
    await fetch(`${API_URL}/api/skills/synonym`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message)
    });
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

let extensionSkillRepository: ChromeSkillRepository;

async function invokeStorageMethod(message: StorageRequest): Promise<unknown> {
  extensionSkillRepository = new ChromeSkillRepository();
  switch (message.method) {
    case "getJobPostingSkills":
      return extensionSkillRepository.getJobPostingSkills(message.args[0] as JobPostingData);
    case "getSkills":
      return extensionSkillRepository.getSkills(message.args[0] as any);
    case "getSkillTexts":
      return extensionSkillRepository.getSkillTexts();
    case "getCategories":
      return extensionSkillRepository.getCategories();
    case "getVisitedLinks":
      return extensionSkillRepository.getVisitedLinks(message.args[0] as string[]);
    case "createSkill":
      return extensionSkillRepository.createSkill(message.args[0] as SkillSaveTriggeredMessage["message"]);
    case "editSkill":
      return extensionSkillRepository.editSkill(message.args[0] as SkillEditTriggeredMessage["message"]);
    case "addSynonym":
      return extensionSkillRepository.addSynonym(message.args[0] as SynonymAddTriggeredMessage["message"]);
    case "removeSynonym":
      return extensionSkillRepository.removeSynonym(message.args[0] as SynonymRemoveTriggeredMessage["message"]);
    case "suggestSkillSynonyms":
      return extensionSkillRepository.suggestSkillSynonyms();
    case "ignoreSuggestedGroup":
      return extensionSkillRepository.ignoreSuggestedGroup(message.args[0] as IgnoreSuggestedSkillSynonymsRequest);
  }
}

function isStorageRequest(message: unknown): message is StorageRequest {
  if (!message || typeof message !== "object") {
    return false;
  }

  const request = message as Partial<StorageRequest>;
  return request.type === STORAGE_REQUEST_TYPE && typeof request.method === "string" && Array.isArray(request.args);
}

export function handleSkillStorageMessage(
  message: unknown,
  sendResponse: (response: StorageResponse) => void
): boolean {
  if (!isStorageRequest(message)) {
    return false;
  }

  void invokeStorageMethod(message)
    .then((result) => sendResponse({ ok: true, result }))
    .catch((error) => sendResponse({ ok: false, error: getErrorMessage(error) }));
  return true;
}
