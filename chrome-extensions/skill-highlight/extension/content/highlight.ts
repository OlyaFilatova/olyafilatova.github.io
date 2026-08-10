import { getTextNodes, unwrapElements, unwrapHighlights } from "./dom-utils";

import { Familiarity } from "../shared/types";
import { createSkillMatcher, MatchRange, SkillMatcher, UniqueSkillForMatching } from "./parser";


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


function isFamiliarityClass(className: string): boolean {
  return [
    "skill--know-in-depth",
    "skill--study",
    "skill--actively-using",
    "skill--know-a-bit",
    "skill--unknown"
  ].includes(className);
}


// Require Skill Matcher:

function wrapMatchesInTextNode(textNode: Text, skills: UniqueSkillForMatching[] | SkillMatcher): MatchRange[] {
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