import * as zod from "zod";

const localizedString = zod.object({
  "en": zod.string().min(1),
  "ua": zod.string().min(1)
});

const Status = zod.enum(['not-started', 'in-progress-first-read', 'first-read', 'in-progress-thorough-read', 'read']);
const Access = zod.enum(['free', 'paid']);

export const BookSource = zod.object({
  "kind": zod.literal("book"),
  "status": Status,
  "title": localizedString,
  "access": Access,
  "link": zod.string().min(1),
  "thoughts": zod.array(localizedString)
});

export const DocumentationSource = zod.object({
  "kind": zod.literal("documentation"),
  "status": Status,
  "title": localizedString,
  "access": zod.literal('free'),
  "link": zod.string().min(1),
  "thoughts": zod.array(localizedString)
});

export const KnowledgeSource = zod.union([BookSource, DocumentationSource]);

export type Status = zod.infer<typeof Status>;
export type BookSource = zod.infer<typeof BookSource>;
export type DocumentationSource = zod.infer<typeof DocumentationSource>;
export type KnowledgeSource = zod.infer<typeof KnowledgeSource>;
