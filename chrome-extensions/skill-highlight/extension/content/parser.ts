import { Familiarity, SkillType, Temperature } from "../shared/types";

export interface UniqueSkillForMatching {
  normalizedText: string;
  text: string;
  familiarity: Familiarity;
  temperature: Temperature;
  type: SkillType;
  parentSkillId?: string;
  // companyCount: number;
  // skillIds: string[];
  // synonymSkillId?: string;
  // prefillSkillId?: string;
  // prefillParentSkillId?: string;
  // prefillSynonymSkillId?: string;
}

export interface MatchRange {
  start: number;
  end: number;
  skill: UniqueSkillForMatching;
}

export interface SkillMatcher {
  findMatches(text: string): MatchRange[];
}

interface SkillTrieNode {
  children: Map<string, SkillTrieNode>;
  whitespaceChild?: SkillTrieNode;
  skills: UniqueSkillForMatching[];
}

interface CompiledSkillTrie {
  sensitiveRoot: SkillTrieNode;
  insensitiveRoot: SkillTrieNode;
}

function codePointAt(text: string, index: number): string | undefined {
  if (index < 0 || index >= text.length) {
    return undefined;
  }
  const codePoint = text.codePointAt(index);
  return codePoint === undefined ? undefined : String.fromCodePoint(codePoint);
}

function nextCodePointIndex(text: string, index: number): number {
  const character = codePointAt(text, index);
  return index + (character?.length ?? 1);
}

function codePointBefore(text: string, index: number): string | undefined {
  if (index <= 0 || index > text.length) {
    return undefined;
  }

  const previous = text.charCodeAt(index - 1);
  if (previous >= 0xdc00 && previous <= 0xdfff && index > 1) {
    const beforePrevious = text.charCodeAt(index - 2);
    if (beforePrevious >= 0xd800 && beforePrevious <= 0xdbff) {
      return text.slice(index - 2, index);
    }
  }

  return text.slice(index - 1, index);
}

function isWordCharacter(character: string): boolean {
  return /[\p{L}\p{N}_]/u.test(character);
}

function hasWordBoundaryBefore(text: string, index: number): boolean {
  if (index <= 0) {
    return true;
  }

  const previous = codePointBefore(text, index);
  return !previous || !isWordCharacter(previous);
}

function hasWordBoundaryAfter(text: string, index: number): boolean {
  if (index >= text.length) {
    return true;
  }

  const next = codePointAt(text, index);
  return !next || !isWordCharacter(next);
}

function isWhitespaceAt(text: string, index: number): boolean {
  const character = codePointAt(text, index);
  return Boolean(character && /\s/u.test(character));
}

function skipWhitespace(text: string, index: number): number {
  let cursor = index;
  while (cursor < text.length && isWhitespaceAt(text, cursor)) {
    cursor = nextCodePointIndex(text, cursor);
  }
  return cursor;
}

function findTrieMatchesAt(
  text: string,
  start: number,
  root: SkillTrieNode,
  caseSensitive: boolean
): MatchRange[] {
  const matches: MatchRange[] = [];
  const states: Array<{ node: SkillTrieNode; index: number }> = [{ node: root, index: start }];

  while (states.length > 0) {
    const { node, index } = states.pop()!;

    if (node.skills.length > 0 && hasWordBoundaryAfter(text, index)) {
      for (const skill of node.skills) {
        matches.push({ start, end: index, skill });
      }
    }

    if (index >= text.length) {
      continue;
    }

    if (node.whitespaceChild && isWhitespaceAt(text, index)) {
      states.push({ node: node.whitespaceChild, index: skipWhitespace(text, index) });
    }

    const character = codePointAt(text, index);
    if (!character) {
      continue;
    }

    const key = caseSensitive ? character : character.toLowerCase();
    const child = node.children.get(key);
    if (child) {
      states.push({ node: child, index: index + character.length });
    }
  }

  return matches;
}

function compareMatchPriority(first: MatchRange, second: MatchRange): number {
  return (
    second.skill.normalizedText.length - first.skill.normalizedText.length ||
    (second.end - second.start) - (first.end - first.start) ||
    first.start - second.start
  );
}

function findNonOverlappingMatchesWithTrie(text: string, trie: CompiledSkillTrie): MatchRange[] {
  const candidates: MatchRange[] = [];

  for (let start = 0; start < text.length;) {
    if (hasWordBoundaryBefore(text, start)) {
      candidates.push(
        ...findTrieMatchesAt(text, start, trie.sensitiveRoot, true),
        ...findTrieMatchesAt(text, start, trie.insensitiveRoot, false)
      );
    }
    start = nextCodePointIndex(text, start);
  }

  const occupied: Array<{ start: number; end: number }> = [];
  const matches: MatchRange[] = [];

  for (const candidate of candidates.sort(compareMatchPriority)) {
    const overlaps = occupied.some((range) => candidate.start < range.end && candidate.end > range.start);
    if (!overlaps) {
      occupied.push({ start: candidate.start, end: candidate.end });
      matches.push(candidate);
    }
  }

  return matches.sort((a, b) => a.start - b.start);
}

function hasUppercaseMajority(text: string): boolean {
  let uppercaseCount = 0;
  let lowercaseCount = 0;

  for (const character of text) {
    if (/\p{Lu}/u.test(character)) {
      uppercaseCount += 1;
    } else if (/\p{Ll}/u.test(character)) {
      lowercaseCount += 1;
    }
  }

  return uppercaseCount > lowercaseCount;
}

function createSkillTrie(skills: UniqueSkillForMatching[]): CompiledSkillTrie {
  const sensitiveRoot = createTrieNode();
  const insensitiveRoot = createTrieNode();

  for (const skill of skills) {
    insertSkillIntoTrie(
      hasUppercaseMajority(skill.normalizedText) ? sensitiveRoot : insensitiveRoot,
      skill,
      !hasUppercaseMajority(skill.normalizedText)
    );
  }

  return { sensitiveRoot, insensitiveRoot };
}

function createTrieNode(): SkillTrieNode {
  return {
    children: new Map(),
    skills: []
  };
}

function insertSkillIntoTrie(root: SkillTrieNode, skill: UniqueSkillForMatching, caseInsensitive: boolean): void {
  const parts = skill.normalizedText.split(" ").filter(Boolean);
  if (parts.length === 0) {
    return;
  }

  let node = root;
  for (const [partIndex, part] of parts.entries()) {
    if (partIndex > 0) {
      node.whitespaceChild ??= createTrieNode();
      node = node.whitespaceChild;
    }

    for (const character of Array.from(part)) {
      const key = caseInsensitive ? character.toLowerCase() : character;
      const child = node.children.get(key) ?? createTrieNode();
      node.children.set(key, child);
      node = child;
    }
  }

  node.skills.push(skill);
}

export function createSkillMatcher(skills: UniqueSkillForMatching[]): SkillMatcher {
  const trie = createSkillTrie(skills);

  return {
    findMatches(text) {
      return findNonOverlappingMatchesWithTrie(text, trie);
    }
  };
}
