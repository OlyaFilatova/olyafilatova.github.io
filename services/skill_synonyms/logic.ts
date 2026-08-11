
// interface SuggestedSynonymSkill {
//   normalizedText: string;
//   displayText: string;
//   matchTexts: string[];
//   parendSkill: string | undefined;
// }

// interface SuggestedSynonymGroup {
//   id: string;
//   skills: SuggestedSynonymSkill[];
//   score: number;
// }

// const SIMILARITY_THRESHOLD = 0.95;
// const IGNORED_SUGGESTED_GROUPS_KEY = "ignored_suggested_synonym_groups_v1";

// let suggestedSynonymGroups: SuggestedSynonymGroup[] | null = null;
// let ignoredSuggestedGroupIds = loadIgnoredSuggestedGroupIds();

// function ignoreSuggestedSynonymGroup(groupId: string): void {
//   ignoredSuggestedGroupIds.add(groupId);
//   saveIgnoredSuggestedGroupIds();
// }

// function hideSuggestedSynonymSkill(normalizedText: string): void {
//   if (!suggestedSynonymGroups) {
//     return;
//   }

//   suggestedSynonymGroups = suggestedSynonymGroups
//     .map((group) => ({
//       ...group,
//       skills: group.skills.filter((skill) => skill.normalizedText !== normalizedText)
//     }))
//     .filter((group) => group.skills.length > 1);
//   renderSuggestedSynonymGroups();
// }

// function getSuggestedSynonymGroups(): SuggestedSynonymGroup[] {
//   const skills: SuggestedSynonymSkill[] = aggregates.map((aggregate) => ({
//     normalizedText: aggregate.normalizedText,
//     displayText: aggregate.displayText,
//     matchTexts: getSuggestedSynonymMatchTexts(aggregate),
//     parendSkill: aggregate.parendSkill
//   }));
//   const pairScores = new Map<string, number>();

//   for (let outerIndex = 0; outerIndex < skills.length; outerIndex += 1) {
//     for (let innerIndex = outerIndex + 1; innerIndex < skills.length; innerIndex += 1) {
//       const first = skills[outerIndex];
//       const second = skills[innerIndex];
//       const score = getSkillSimilarityScore(first, second);
//       if (score > 0) {
//         pairScores.set(pairKey(first.normalizedText, second.normalizedText), score);
//       }
//     }
//   }

//   const candidateGroups: SuggestedSynonymSkill[][] = [];
//   for (let outerIndex = 0; outerIndex < skills.length; outerIndex += 1) {
//     for (let innerIndex = outerIndex + 1; innerIndex < skills.length; innerIndex += 1) {
//       const first = skills[outerIndex];
//       const second = skills[innerIndex];
//       if (!pairScores.has(pairKey(first.normalizedText, second.normalizedText))) {
//         continue;
//       }

//       const group = [first, second];
//       for (const candidate of skills) {
//         if (group.some((skill) => skill.normalizedText === candidate.normalizedText)) {
//           continue;
//         }

//         if (group.every((skill) => pairScores.has(pairKey(skill.normalizedText, candidate.normalizedText)))) {
//           group.push(candidate);
//         }
//       }
//       candidateGroups.push(group.sort((firstSkill, secondSkill) => firstSkill.displayText.localeCompare(secondSkill.displayText)));
//     }
//   }

//   const groups = getMaximalGroups(candidateGroups).map((group) => ({
//     id: groupKey(group),
//     skills: group,
//     score: getSuggestedSynonymGroupScore(group, pairScores)
//   })).filter((group) => !ignoredSuggestedGroupIds.has(group.id));

//   return groups.sort((first, second) => {
//     if (first.score !== second.score) {
//       return second.score - first.score;
//     }
//     const firstName = first.skills[0]?.displayText ?? "";
//     const secondName = second.skills[0]?.displayText ?? "";
//     return firstName.localeCompare(secondName);
//   });
// }

// function getMaximalGroups(groups: SuggestedSynonymSkill[][]): SuggestedSynonymSkill[][] {
//   const uniqueGroups: SuggestedSynonymSkill[][] = [];
//   for (const group of groups) {
//     if (!hasExistingGroup(group, uniqueGroups)) {
//       uniqueGroups.push(group);
//     }
//   }

//   return uniqueGroups.filter((group) => !uniqueGroups.some((other) => isSubsetOfGroup(group, other)));
// }

// function getSuggestedSynonymGroupScore(group: SuggestedSynonymSkill[], pairScores: Map<string, number>): number {
//   let score = 0;
//   for (let outerIndex = 0; outerIndex < group.length; outerIndex += 1) {
//     for (let innerIndex = outerIndex + 1; innerIndex < group.length; innerIndex += 1) {
//       score = Math.max(score, pairScores.get(pairKey(group[outerIndex].normalizedText, group[innerIndex].normalizedText)) ?? 0);
//     }
//   }
//   return score;
// }

// function getSuggestedSynonymMatchTexts(aggregate: SkillAggregate): string[] {
//   return [...new Set([aggregate.displayText, ...aggregate.synonymTexts].map((text) => text.trim()).filter(Boolean))];
// }

// function getSkillSimilarityScore(first: SuggestedSynonymSkill, second: SuggestedSynonymSkill): number {
//   let score = 0;
//   for (const firstText of first.matchTexts) {
//     for (const secondText of second.matchTexts) {
//       score = Math.max(score, getSkillNameSimilarityScore(firstText, secondText));
//     }
//   }
//   return score;
// }

// function saveIgnoredSuggestedGroupIds(): void {
//   try {
//     localStorage.setItem(IGNORED_SUGGESTED_GROUPS_KEY, JSON.stringify([...ignoredSuggestedGroupIds]));
//   } catch {
//     // Ignored suggestions are a UI preference; failing to persist should not block the page.
//   }
// }


// async function updateSuggestedSynonym(normalizedText: string, synonymSkillId: string): Promise<void> {
//   const scrollTop = getScrollTop();
//   suppressNextSkillsChangedEvent = true;
//   try {
//     await skillRepository.updateSynonymForText(normalizedText, synonymSkillId);
//     await notifyJobTabs({ type: "RELOAD_HIGHLIGHTS" });
//     aggregates = await skillRepository.getAggregates();
//     hideSuggestedSynonymSkill(normalizedText);
//     restoreScrollTop(scrollTop);
//   } catch (error) {
//     suppressNextSkillsChangedEvent = false;
//     throw error;
//   }
// }

// async function updateSuggestedParent(normalizedText: string, parentSkillId?: string): Promise<void> {
//   const scrollTop = getScrollTop();
//   suppressNextSkillsChangedEvent = true;
//   try {
//     await skillRepository.updateParentForText(normalizedText, parentSkillId);
//     aggregates = await skillRepository.getAggregates();
//     updateSuggestedParentInPlace(normalizedText, parentSkillId);
//     restoreScrollTop(scrollTop);
//   } catch (error) {
//     suppressNextSkillsChangedEvent = false;
//     throw error;
//   }
// }

// function isSubsetOfGroup(group: SuggestedSynonymSkill[], other: SuggestedSynonymSkill[]): boolean {
//   if (other.length <= group.length) {
//     return false;
//   }

//   const otherTexts = new Set(other.map((skill) => skill.normalizedText));
//   return group.every((skill) => otherTexts.has(skill.normalizedText));
// }

// function hasExistingGroup(group: SuggestedSynonymSkill[], groups: SuggestedSynonymSkill[][]): boolean {
//   const key = groupKey(group);
//   return groups.some((existingGroup) => groupKey(existingGroup) === key);
// }


// function groupKey(group: SuggestedSynonymSkill[]): string {
//   return group.map((skill) => skill.normalizedText).sort().join("|");
// }

// function getSkillNameSimilarityScore(first: string, second: string): number {
//   const comparableFirst = normalizeComparableSkillName(first);
//   const comparableSecond = normalizeComparableSkillName(second);
//   if (!comparableFirst.compact || !comparableSecond.compact) {
//     return 0;
//   }

//   if (textSimilarity(comparableFirst.compact, comparableSecond.compact) >= SIMILARITY_THRESHOLD) {
//     return 3;
//   }

//   if (textIncludesText(comparableFirst, comparableSecond)) {
//     return 2;
//   }

//   return isAbbreviationOf(comparableFirst, comparableSecond) || isAbbreviationOf(comparableSecond, comparableFirst) ? 1 : 0;
// }

// function normalizeComparableSkillName(text: string): {
//   compact: string;
//   words: string[];
//   abbreviations: string[];
//   isAcronymLike: boolean;
// } {
//   const transliterated = transliterateCyrillic(text)
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "");
//   const words = transliterated
//     .replace(/([a-z])([A-Z])/g, "$1 $2")
//     .split(/[^A-Za-z0-9]+/)
//     .filter(Boolean);
//   const compact = words.join("").toLowerCase();
//   const abbreviations = new Set<string>();
//   if (words.length > 1) {
//     abbreviations.add(words.map((word) => word[0]).join("").toLowerCase());
//   }
//   const uppercaseAbbreviation = transliterated.replace(/[^A-Z0-9]/g, "").toLowerCase();
//   if (uppercaseAbbreviation.length > 1) {
//     abbreviations.add(uppercaseAbbreviation);
//   }
//   const alphaText = transliterated.replace(/[^A-Za-z]/g, "");
//   const isAcronymLike = alphaText.length > 1 && alphaText === alphaText.toUpperCase();

//   return { compact, words: words.map((word) => word.toLowerCase()), abbreviations: [...abbreviations], isAcronymLike };
// }

// function updateSuggestedParentInPlace(normalizedText: string, parentSkillId?: string): void {
//   if (!suggestedSynonymGroups) {
//     return;
//   }

//   suggestedSynonymGroups = suggestedSynonymGroups.map((group) => ({
//     ...group,
//     skills: group.skills.map((skill) => (
//       skill.normalizedText === normalizedText ? { ...skill, parendSkill: parentSkillId } : skill
//     ))
//   }));
// }

// function pairKey(first: string, second: string): string {
//   return [first, second].sort().join("|");
// }


// function textIncludesText(
//   first: { words: string[]; isAcronymLike: boolean },
//   second: { words: string[]; isAcronymLike: boolean }
// ): boolean {
//   return wordSequenceIncludes(first, second) || wordSequenceIncludes(second, first);
// }

// function wordSequenceIncludes(
//   maybeLonger: { words: string[]; isAcronymLike: boolean },
//   maybeShorter: { words: string[]; isAcronymLike: boolean }
// ): boolean {
//   if (maybeShorter.words.length === 0 || maybeShorter.words.length > maybeLonger.words.length) {
//     return false;
//   }

//   if (maybeShorter.words.length === 1) {
//     const [shortWord] = maybeShorter.words;
//     if (shortWord.length <= 2) {
//       if (shortWord.length === 1) {
//         return false;
//       }
//       return !maybeShorter.isAcronymLike && maybeLonger.words.some((word) => word.startsWith(shortWord));
//     }
//   }

//   return maybeLonger.words.some((_word, index) =>
//     maybeShorter.words.every((shortWord, shortIndex) => maybeLonger.words[index + shortIndex] === shortWord)
//   );
// }

// function textSimilarity(first: string, second: string): number {
//   const maxLength = Math.max(first.length, second.length);
//   if (maxLength === 0) {
//     return 1;
//   }
//   return (maxLength - levenshteinDistance(first, second)) / maxLength;
// }

// function levenshteinDistance(first: string, second: string): number {
//   const previous = Array.from({ length: second.length + 1 }, (_, index) => index);
//   const current = Array.from({ length: second.length + 1 }, () => 0);

//   for (let firstIndex = 1; firstIndex <= first.length; firstIndex += 1) {
//     current[0] = firstIndex;
//     for (let secondIndex = 1; secondIndex <= second.length; secondIndex += 1) {
//       const substitutionCost = first[firstIndex - 1] === second[secondIndex - 1] ? 0 : 1;
//       current[secondIndex] = Math.min(
//         current[secondIndex - 1] + 1,
//         previous[secondIndex] + 1,
//         previous[secondIndex - 1] + substitutionCost
//       );
//     }
//     previous.splice(0, previous.length, ...current);
//   }

//   return previous[second.length];
// }

// function isAbbreviationOf(
//   possibleAbbreviation: { compact: string },
//   possibleFullName: { abbreviations: string[] }
// ): boolean {
//   return possibleAbbreviation.compact.length > 1 && possibleFullName.abbreviations.includes(possibleAbbreviation.compact);
// }

// function transliterateCyrillic(text: string): string {
//   const letters: Record<string, string> = {
//     а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ё: "e", ж: "zh", з: "z",
//     и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
//     с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ъ: "",
//     ы: "y", ь: "", э: "e", ю: "iu", я: "ia"
//   };

//   return [...text].map((character) => {
//     const lower = character.toLowerCase();
//     const transliterated = letters[lower];
//     if (transliterated === undefined) {
//       return character;
//     }
//     return character === lower ? transliterated : capitalize(transliterated);
//   }).join("");
// }

// function capitalize(text: string): string {
//   return text.charAt(0).toUpperCase() + text.slice(1);
// }
