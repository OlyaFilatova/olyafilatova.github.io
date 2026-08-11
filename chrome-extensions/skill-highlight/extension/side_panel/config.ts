import { Familiarity, SkillType, Temperature } from "../shared/types";

export const FAMILIARITIES: Familiarity[] = ["know-in-depth", "study", "actively-using", "know-a-bit", "unknown"];
export const FAMILIARITY_SCORES: Record<Familiarity, number> = {
  'unknown': -2,
  'know-a-bit': 0,
  'study': 1,
  'actively-using': 2,
  'know-in-depth': 3
};

export const TEMPERATURES: Temperature[] = ["interested", "meh", "avoid!"];
export const SIMILARITY_THRESHOLD = 0.95;
export const IGNORED_SUGGESTED_GROUPS_KEY = "ignored_suggested_synonym_groups_v1";

export const SKILL_TYPES: SkillType[] = ["Approach", "Application", "Non-skill"];
