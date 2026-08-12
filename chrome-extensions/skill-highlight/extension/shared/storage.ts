import { normalizeSkillText } from "./skill";
import { JobPostingData, SkillAggregate, SkillEditTriggeredMessage, SkillFilters, SkillIgnoreTriggeredMessage, SkillSaveTriggeredMessage } from "./types";


interface SkillRepository {
  getJobPostingSkills(jobPostingData: JobPostingData): Promise<any>;
  getSkills(skillFilters: SkillFilters): Promise<SkillAggregate[]>;
  getCategories(): Promise<string[]>;
  getVisitedLinks(links: string[]): Promise<string[]>;
  createSkill(skillData: Omit<SkillSaveTriggeredMessage, 'type'>): Promise<void>;
  editSkill(skillData: Omit<SkillEditTriggeredMessage, 'type'>): Promise<void>;
  ignoreSkill(skillData: Omit<SkillIgnoreTriggeredMessage, 'type'>): Promise<void>;
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

    return [result["total_rows"], result["skills"].map((skill: any) => ({
      normalizedText: skill.normalized_text,
      displayText: skill.display_text,
      familiarity: skill.familiarity,
      temperature: skill.temperature,
      type: skill.type,
      normalizedSynonyms: skill.synonyms,
      synonymTexts: skill.synonym_texts,
      categories: skill.categories,
      mentions: skill.urls,
      companyCount: skill.company_count,
      companies: skill.companies,
    }))];
  }

  async createSkill(skillData: Omit<SkillSaveTriggeredMessage, 'type'>): Promise<void> {
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
    const normalizedText = skillSaveResult["normalized_text"];

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

    return normalizedText;
  }

  async editSkill({ url, ...skillData }: Omit<SkillEditTriggeredMessage, 'type'>): Promise<void> {
    await fetch(`${API_URL}/api/skills/edit`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skillData)
    });
  }

  async ignoreSkill(skillData: Omit<SkillIgnoreTriggeredMessage, 'type'>): Promise<void> {
    await fetch(`${API_URL}/api/job-skills/ignore`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(skillData)
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
    case "getCategories":
      return extensionSkillRepository.getCategories();
    case "getVisitedLinks":
      return extensionSkillRepository.getVisitedLinks(message.args[0] as string[]);
    case "createSkill":
      return extensionSkillRepository.createSkill(message.args[0] as Omit<SkillSaveTriggeredMessage, 'type'>);
    case "editSkill":
      return extensionSkillRepository.editSkill(message.args[0] as Omit<SkillEditTriggeredMessage, 'type'>);
    case "ignoreSkill":
      return extensionSkillRepository.ignoreSkill(message.args[0] as Omit<SkillIgnoreTriggeredMessage, 'type'>);
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
