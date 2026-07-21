import * as zod from "zod";

const localizedString = zod.object({
  "en": zod.string().min(1),
  "uk": zod.string().min(1)
});

const Status = zod.enum(['planned', 'in-progress-first-read', 'first-read', 'in-progress-thorough-read', 'read', 'paused']);
const Access = zod.enum(['free', 'paid']);

export const KnowledgeSource = zod.object({
  "kind": zod.enum(["book", "documentation", "paper", "web-page"]),
  "status": Status,
  "title": localizedString,
  "access": Access,
  "link": zod.string().min(1),
  "thoughts": zod.optional(zod.array(localizedString)),
  "categories": zod.optional(zod.array(localizedString)),
  "date": zod.optional(zod.string().pipe(zod.coerce.date()))
});

export type Status = zod.infer<typeof Status>;
export type KnowledgeSource = zod.infer<typeof KnowledgeSource>;

export type ThoughtsIndex = {
  count: number;
  categories: Record<string, number[]>;
  status: Partial<Record<KnowledgeSource["status"], number[]>>;
  kind: Partial<Record<KnowledgeSource["kind"], number[]>>;
  access: Partial<Record<KnowledgeSource["access"], number[]>>;
};
