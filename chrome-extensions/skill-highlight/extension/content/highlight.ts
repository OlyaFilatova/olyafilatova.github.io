import { getTextNodes, unwrapElements, unwrapHighlights } from "./dom-utils";

import { normalizeSkillText } from "../shared/skill";
import { Familiarity, SkillType } from "../shared/types";
import { createSkillMatcher, MatchRange, SkillMatcher, UniqueSkillForMatching } from "./parser";

export function highlightSkillInElement(root: HTMLElement, skill: UniqueSkillForMatching): void {
  highlightSkillInElementAndCount(root, skill);
}

export function removeSkillHighlights(root: HTMLElement, normalizedText: string): void {
  for (const highlight of root.querySelectorAll<HTMLElement>(".skill-highlight")) {
    if (
      highlight.dataset.normalizedText === normalizedText ||
      normalizeSkillText(highlight.textContent?.trim() ?? "") === normalizedText
    ) {
      unwrapHighlight(highlight);
    }
  }
}

export function updateSkillHighlightFamiliarity(
  root: HTMLElement,
  normalizedText: string,
  familiarity: Familiarity
): void {
  for (const highlight of root.querySelectorAll<HTMLElement>(".skill-highlight")) {
    if (highlight.dataset.normalizedText !== normalizedText) {
      continue;
    }

    setHighlightFamiliarityClass(highlight, familiarity);
  }
}

export function updateSkillHighlightSkillType(
  root: HTMLElement,
  normalizedText: string,
  skillType: SkillType
): void {
  for (const highlight of root.querySelectorAll<HTMLElement>(".skill-highlight")) {
    if (highlight.dataset.normalizedText !== normalizedText) {
      continue;
    }

    setHighlightSkillTypeClass(highlight, skillType);
  }
}

function unwrapOverlappingHighlights(root: HTMLElement, skill: UniqueSkillForMatching): void {
  const text = root.textContent ?? "";
  const matches = findNonOverlappingMatches(text, [skill]);
  if (matches.length === 0) {
    return;
  }

  const matchedRanges = matches.map(({ start, end }) => ({ start, end }));
  const highlights = [...root.querySelectorAll<HTMLElement>(".skill-highlight")];

  for (const highlight of highlights) {
    if (highlight.dataset.normalizedText === skill.normalizedText) {
      continue;
    }

    const range = getTextRangeWithin(root, highlight);
    if (range && matchedRanges.some((match) => rangesOverlap(match, range))) {
      unwrapHighlight(highlight);
    }
  }
}

function getTextRangeWithin(root: HTMLElement, element: HTMLElement): { start: number; end: number } | null {
  const rootRange = document.createRange();
  const elementRange = document.createRange();

  try {
    rootRange.selectNodeContents(root);
    rootRange.setEndBefore(element);
    elementRange.selectNodeContents(element);

    const start = rootRange.toString().length;
    return {
      start,
      end: start + elementRange.toString().length
    };
  } catch {
    return null;
  } finally {
    rootRange.detach();
    elementRange.detach();
  }
}

function rangesOverlap(first: { start: number; end: number }, second: { start: number; end: number }): boolean {
  return first.start < second.end && first.end > second.start;
}

function temperatureClass(temperature: UniqueSkillForMatching["temperature"]): string {
  return temperature === "avoid!" ? "skill--temperature-avoid" : "skill--temperature-default";
}

function setHighlightFamiliarityClass(highlight: HTMLElement, familiarity: Familiarity): void {
  for (const className of [...highlight.classList]) {
    if (className.startsWith("skill--") && isFamiliarityClass(className)) {
      highlight.classList.remove(className);
    }
  }
  highlight.classList.add(`skill--${familiarity}`);
}

function setHighlightSkillTypeClass(highlight: HTMLElement, skillType: SkillType): void {
  for (const className of [...highlight.classList]) {
    if (className.startsWith("skill--type-")) {
      highlight.classList.remove(className);
    }
  }
  highlight.classList.add(`skill--type-${skillType}`);
}

function isFamiliarityClass(className: string): boolean {
  return [
    "skill--know-in-depth",
    "skill--study",
    "skill--actively-using",
    "skill--know-a-bit",
    "skill--unknown"
  ].includes(className);
}

function unwrapHighlight(highlight: HTMLElement): void {
  const parent = highlight.parentNode;
  if (!parent) {
    return;
  }

  while (highlight.firstChild) {
    parent.insertBefore(highlight.firstChild, highlight);
  }

  parent.removeChild(highlight);
  parent.normalize();
}


// Require Skill Matcher:

export function highlightSkillsInElement(root: HTMLElement, skills: UniqueSkillForMatching[]): UniqueSkillForMatching[] {
  unwrapHighlights(root);
  unwrapElements(root, "strong");

  const matcher = createSkillMatcher(skills);
  const matchedByText = new Map<string, UniqueSkillForMatching>();
  const textNodes = getTextNodes(root);
  console.log('textNodes', textNodes)
  for (const textNode of textNodes) {
    for (const match of wrapMatchesInTextNode(textNode, matcher)) {
      console.log('wrapping')
      matchedByText.set(match.skill.normalizedText, match.skill);
    }
  }

  return [...matchedByText.values()];
}

export function highlightSkillInElementAndCount(root: HTMLElement, skill: UniqueSkillForMatching): number {
  unwrapOverlappingHighlights(root, skill);
  unwrapElements(root, "strong");

  const matcher = createSkillMatcher([skill]);
  let highlightCount = 0;
  for (const textNode of getTextNodes(root)) {
    highlightCount += wrapMatchesInTextNode(textNode, matcher).length;
  }
  return highlightCount;
}

// Require Skill Matcher but used only here:

export function collectMatchedSkillsInElement(
  root: HTMLElement,
  skills: UniqueSkillForMatching[]
): UniqueSkillForMatching[] {
  unwrapElements(root, "strong");

  const matcher = createSkillMatcher(skills);
  const matchedByText = new Map<string, UniqueSkillForMatching>();

  for (const textNode of getTextNodes(root)) {
    for (const match of matcher.findMatches(textNode.nodeValue ?? "")) {
      matchedByText.set(match.skill.normalizedText, match.skill);
    }
  }

  return [...matchedByText.values()];
}

export function wrapMatchesInTextNode(textNode: Text, skills: UniqueSkillForMatching[] | SkillMatcher): MatchRange[] {
  const text = textNode.nodeValue ?? "";
  const matcher = Array.isArray(skills) ? createSkillMatcher(skills) : skills;
  const matches = matcher.findMatches(text);

  if (matches.length === 0 || !textNode.parentNode) {
    return [];
  }

  const fragment = document.createDocumentFragment();
  let cursor = 0;

  for (const match of matches) {
    if (match.start > cursor) {
      fragment.append(document.createTextNode(text.slice(cursor, match.start)));
    }

    const span = document.createElement("span");
    span.classList.add("skill-highlight");
    setHighlightFamiliarityClass(span, match.skill.familiarity);
    span.classList.add(
      // `skill--popular-${getPopularityLevel(match.skill.companyCount)}`,
      temperatureClass(match.skill.temperature),
      `skill--familiarity-${match.skill.familiarity}`,
      `skill--type-${match.skill.type}`
    );
    span.dataset.normalizedText = match.skill.normalizedText;
    span.role = "button";
    span.tabIndex = 0;
    span.textContent = text.slice(match.start, match.end);
    fragment.append(span);
    cursor = match.end;
  }

  if (cursor < text.length) {
    fragment.append(document.createTextNode(text.slice(cursor)));
  }

  textNode.parentNode.replaceChild(fragment, textNode);
  return matches;
}

export function findNonOverlappingMatches(text: string, skills: UniqueSkillForMatching[]): MatchRange[] {
  return createSkillMatcher(skills).findMatches(text);
}
