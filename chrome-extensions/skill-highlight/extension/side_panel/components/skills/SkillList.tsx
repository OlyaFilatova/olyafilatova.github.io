import { useEffect, useState } from "react";
import Skill from "./Skill";
import { SkillAggregate } from "../../../shared/types";

export default function SkillList({ skills }: { skills: SkillAggregate[] }) {
  const [skillTexts, setSkillTexts] = useState<Array<{
    normalizedText: string;
    displayText: string;
  }>>([]);

  useEffect(() => {
    setSkillTexts(skills.map(skill => ({
      normalizedText: skill.normalizedText,
      displayText: skill.displayText
    })))
  }, [skills]);

  return (
    <section id="skillList" className="skill-list" aria-live="polite">
      {skills.map(skill => <Skill key={skill.normalizedText} skill={skill} skillTexts={skillTexts} />)}
    </section>
  )
}

// function uniqueSorted(values: string[]): string[] {
//   return [...new Set(values)].sort((first, second) => first.localeCompare(second));
// }

// function filterAggregateMentions(
//   aggregate: SkillAggregate,
//   category: string,
//   currentPageOnly: boolean
// ): SkillAggregate | null {
//   if (!category && !currentPageOnly) {
//     return aggregate;
//   }

//   const mentions = aggregate.mentions.filter((mention) => (
//     (!category || mention.category === category) &&
//     (!currentPageOnly || urlsMatch(mention.url, currentPageUrl))
//   ));
//   if (mentions.length === 0) {
//     return null;
//   }

//   const companies = uniqueSorted(mentions.map((mention) => mention.company));
//   const categories = uniqueSorted(mentions.map((mention) => mention.category));
//   return {
//     ...aggregate,
//     companyCount: companies.length,
//     companies,
//     categories,
//     mentions
//   };
// }

// function compareAggregates(a: SkillAggregate, b: SkillAggregate): number {
//   if (elements.sortBy?.value === "companyCount") {
//     return b.companyCount - a.companyCount || a.displayText.localeCompare(b.displayText);
//   }

//   return a.displayText.localeCompare(b.displayText);
// }

// function getFilteredAggregates(): SkillAggregate[] {
//   const search = elements.search?.value.trim().toLowerCase() ?? "";
//   const category = elements.categoryFilter?.value ?? "";
//   const type = elements.typeFilter?.value ?? "";
//   const familiarity = elements.familiarityFilter?.value as Familiarity | "";
//   const temperature = elements.temperatureFilter?.value || undefined as Temperature | "any" | undefined;
//   const currentPageOnly = Boolean(elements.currentPageOnly?.checked);

//   return aggregates
//     .flatMap((aggregate) => {
//       const searchable = [
//         aggregate.displayText,
//         aggregate.familiarity,
//         ...aggregate.synonymTexts
//         // ...aggregate.companies
//       ]
//         .join(" ")
//         .toLowerCase();

//       const skillMatches = (
//         (!search || searchable.includes(search)) &&
//         (!familiarity || aggregate.familiarity === familiarity) &&
//         (temperature == 'any' || aggregate.temperature == temperature) &&
//         (type == '' || type == aggregate.type)
//       );

//       if (!skillMatches) {
//         return [];
//       }

//       const filteredAggregate = filterAggregateMentions(aggregate, category, currentPageOnly);
//       return filteredAggregate ? [filteredAggregate] : [];
//     })
//     .sort(compareAggregates);
// }

// function renderSkillList(visibleAggregates: SkillAggregate[]): void {
//   const list = elements.skillList;
//   if (!list) {
//     return;
//   }

//   const existingCards = new Map(
//     [...list.querySelectorAll<HTMLElement>(".skill-card[data-normalized-text]")]
//       .map((card) => [card.dataset.normalizedText!, card])
//   );
//   const nextCards = visibleAggregates.map((aggregate) => {
//     const renderKey = getAggregateRenderKey(aggregate);
//     const existingCard = existingCards.get(aggregate.normalizedText);
//     if (existingCard?.dataset.renderKey === renderKey) {
//       return existingCard;
//     }
//     return renderSkillCard(aggregate, renderKey);
//   });

//   for (const [index, card] of nextCards.entries()) {
//     if (list.children[index] !== card) {
//       list.insertBefore(card, list.children[index] ?? null);
//     }
//   }

//   while (list.children.length > nextCards.length) {
//     list.lastElementChild?.remove();
//   }
// }
