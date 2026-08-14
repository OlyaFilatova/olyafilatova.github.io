/* eslint-disable @typescript-eslint/no-explicit-any */
import { normalizeSkillText } from "./skill";
import { Familiarity, JobPostingData, SkillAggregate, SkillEditTriggeredMessage, SkillFilters, SkillSaveTriggeredMessage, SkillType, SynonymAddTriggeredMessage, SynonymRemoveTriggeredMessage, Temperature } from "./types";


interface SkillRepository {
  getJobPostingSkills(jobPostingData: JobPostingData): Promise<any>;
  getSkills(skillFilters: SkillFilters): Promise<SkillAggregate[]>;
  getCategories(): Promise<string[]>;
  getVisitedLinks(links: string[]): Promise<string[]>;
  createSkill(skillData: SkillSaveTriggeredMessage["message"]): Promise<{
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
  editSkill(skillData: SkillEditTriggeredMessage["message"]): Promise<void>;
  addSynonym(skillData: SynonymAddTriggeredMessage["message"]): Promise<void>;
  removeSynonym(skillData: SynonymRemoveTriggeredMessage["message"]): Promise<void>;
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
  async getJobPostingSkills(
    jobPostingData: {
      url: string;
      body: string;
      category: string;
      company: string;
    }): Promise<any> {
    const response = await fetch(`${API_URL}/api/job-postings/process-job-posting`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobPostingData)
    });

    return (await response.json())["skills"];
  }

  async getCategories(): Promise<string[]> {
    const response = await fetch(`${API_URL}/api/job-skills/categories`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    return (await response.json());
  }

  async getVisitedLinks(links: string[]): Promise<string[]> {
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

  async getSkills(skillFilters: SkillFilters): Promise<SkillAggregate[]> {
    const params = new URLSearchParams();
    Object.entries(skillFilters).filter(entry => !!entry[1]).forEach(([key, value]) => params.append(key, value.toString()));

    const response = await fetch(`${API_URL}/api/job-skills/filter?${params.toString()}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });

    const result = await response.json();

    return [result["totalRows"], result["skills"].map((skill: any) => ({
      normalizedText: skill.normalizedText,
      displayText: skill.displayText,
      familiarity: skill.familiarity,
      temperature: skill.temperature,
      type: skill.type,
      normalizedSynonyms: skill.synonyms,
      synonymTexts: skill.synonymTexts,
      categories: skill.categories,
      mentions: skill.urls,
      companyCount: skill.companyCount,
      companies: skill.companies,
    }))];
  }

  async getSkillTexts(): Promise<Array<{
    displayText: string;
    normalizedText: string;
  }>> {
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

  async createSkill(skillData: SkillSaveTriggeredMessage["message"]): Promise<{
    normalizedText: any;
    displayText: any;
    familiarity: any;
    temperature: any;
    type: any;
  }> {
    const skillsResponse = await fetch(`${API_URL}/api/skills/create`, {
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
    const skillSaveResult = await skillsResponse.json();
    const normalizedText = skillSaveResult["normalizedText"];

    const jobSkillsResponse = await fetch(`${API_URL}/api/job-skills/create`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        normalizedText: normalizedText,
        url: skillData.url
      })
    });

    await jobSkillsResponse.json();

    return {
      normalizedText: skillSaveResult["normalizedText"],
      displayText: skillSaveResult["displayText"],
      familiarity: skillSaveResult["familiarity"],
      temperature: skillSaveResult["temperature"],
      type: skillSaveResult["type"],
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async editSkill({ url, ...skillData }: SkillEditTriggeredMessage["message"]): Promise<void> {
    await fetch(`${API_URL}/api/skills/edit`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skillData)
    });
  }

  async addSynonym({
    synonymNormalizedText,
    normalizedText,
  }: SynonymAddTriggeredMessage["message"]): Promise<void> {
    await fetch(`${API_URL}/api/skills/synonym/create`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        normalizedText: synonymNormalizedText,
        originNormalizedText: normalizedText,
      })
    });
  }

  async removeSynonym({
    synonymText,
    synonymNormalizedText,
    normalizedText,
  }: SynonymRemoveTriggeredMessage["message"]): Promise<void> {
    await fetch(`${API_URL}/api/skills/synonym/remove`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        displayText: synonymText,
        normalizedText: synonymNormalizedText,
        originNormalizedText: normalizedText,
      })
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
      return extensionSkillRepository.getJobPostingSkills(message.args[0] as any);
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
