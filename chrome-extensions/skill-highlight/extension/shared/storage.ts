import { JobPostingData } from "./types";


interface SkillRepository {
  getJobPostingSkills(jobPostingData: JobPostingData): Promise<any>;
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
