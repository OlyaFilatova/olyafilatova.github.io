import * as zod from "zod";

const localizedString = zod.object({
  "en": zod.string().min(1),
  "ua": zod.string().min(1)
});

export const EducationExperience = zod.object({
  "kind": zod.literal("education"),
  "location": localizedString,
  "specialization": localizedString,
  "year": localizedString,
  "skills": zod.array(localizedString)
});

export const JobExperience = zod.object({
  "kind": zod.literal("work"),
  "position": localizedString,
  "tech_stack": localizedString,
  "from": localizedString,
  "to": localizedString,
  "projects": zod.array(localizedString),
  "skills": zod.array(localizedString)
});

export const Experience = zod.union([EducationExperience, JobExperience]);

export type JobExperience = zod.infer<typeof JobExperience>;
export type EducationExperience = zod.infer<typeof EducationExperience>;
export type Experience = zod.infer<typeof Experience>;
