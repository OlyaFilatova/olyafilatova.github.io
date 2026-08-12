import { ContentMessage, Familiarity, SkillAggregate, SkillType, Temperature } from "../../../shared/types";
import { FAMILIARITIES, SKILL_TYPES, TEMPERATURES } from "../../config";
import SelectFilter from "./SelectFilter";

export default function Skill({ skill, skillTexts }: {
  skill: SkillAggregate,
  skillTexts: Array<{
    normalizedText: string;
    displayText: string;
  }>
}) {
  const currentPageUrl = window.location.href;
  return (
    <article className="skill-card">
      <div className="skill-card__top">
        <div>
          <div className="skill-card__title">
            <h2>{skill.displayText}</h2>
            <span className="badge">{companyCountLabel(skill)}</span>
          </div>
          <div className="meta">
            <p><strong>Categories: {skill.categories.join(", ") || "Unknown"}</strong></p>
            <p><strong>Companies: {companyListLabel(skill)}</strong></p>
            <p><strong>Synonyms: {skill.synonymTexts.join(", ") || "None"}</strong></p>
          </div>
          <details className="links-accordion">
            <summary>Links to pages</summary>
            <div className="links">
              {skill.mentions.map(url =>
              <div className="link-row">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className={urlsMatch(url, currentPageUrl) ? 'links__current': ''}>{url}</a>
                <button type="button" className="link-row__ignore" onClick={() => void ignoreMentionsOnPage(skill.normalizedText, url)}>Ignore page</button>
              </div>)}
            </div>
          </details>
        </div>
        <div>
          <div className="controls">
            <SelectFilter
              label="Familiarity"
              options={[
                {value: "", text: "All"},
                ...FAMILIARITIES.map(familiarity => ({
                  value: familiarity,
                  text: familiarity
                }))
              ]}
              currentValue={skill.familiarity}
              onChange={event => void updateFamiliarity(skill.normalizedText, event.target.value as Familiarity)}
             />

            <SelectFilter
              label="Temperature"
              options={[
                {value: "", text: "All"},
                ...TEMPERATURES.map(item => ({
                  value: item,
                  text: item
                }))
              ]}
              currentValue={skill.temperature}
              onChange={event => void updateTemperature(skill.normalizedText, event.target.value as Temperature)}
             />

            <SelectFilter
              label="Type"
              options={[
                {value: "", text: "All"},
                ...SKILL_TYPES.map(item => ({
                  value: item,
                  text: item
                }))
              ]}
              currentValue={skill.type}
              onChange={event => void updateType(skill.normalizedText, event.target.value as SkillType)}
             />

            <SelectFilter
              label="Add synonym"
              options={[
                {value: "", text: "Select skill"},
                ...skillTexts
                  .filter(skillText => !skill.normalizedSynonyms.includes(skillText.normalizedText))
                  .map(skillText => ({
                    value: skillText.normalizedText,
                    text: skillText.displayText
                  }))
              ]}
              currentValue={""}
              onChange={event => {
                void updateSynonym(event.target.value, skill.normalizedText);
              }}
             />

            <SelectFilter
              label="Remove synonym"
              options={[
                {value: "", text: "Select skill"},
                ...skill.normalizedSynonyms
                  .map(skillText => ({
                    value: skillText,
                    text: skillText
                  }))
              ]}
              currentValue={""}
              onChange={event => {
                if (event.target.value) {
                  void updateSynonym(event.target.value, undefined);
                }
              }}
             />

            <button
              type="button"
              className="delete-button"
              onClick={() => void deleteMentions(skill.normalizedText)}
              >Delete mentions</button>
          </div>
        </div>
      </div>
    </article>
  )
}

function companyCountLabel(skill: SkillAggregate): string {
  return `${skill.companyCount} ${skill.companyCount === 1 ? "company" : "companies"}`;
}

function companyListLabel(aggregate: SkillAggregate): string {
  const filteredCompanies = aggregate.companies.join(", ") || "Unknown";

  return `${filteredCompanies}`;
}

function normalizePageUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    return parsed.toString();
  } catch {
    return url;
  }
}

function urlsMatch(first: string, second: string): boolean {
  return normalizePageUrl(first) === normalizePageUrl(second);
}

async function ignoreMentionsOnPage(normalizedText: string, url: string): Promise<void> {
  // await Promise.all(mentions.map((mention) => skillRepository.ignoreOnPage(mention.normalizedText, mention.url)));
  // await notifyJobTabs({
  //   type: "SKILLS_REMOVED",
  //   normalizedTexts: [...new Set(mentions.map((mention) => mention.normalizedText))]
  // });
}

async function notifyJobTabs(message: ContentMessage): Promise<void> {
  // broadcastMessage([], URLS, message)
}

async function deleteMentions(normalizedText: string): Promise<void> {
  // await skillRepository.deleteSkill(normalizedText);
  await notifyJobTabs({ type: "RELOAD_HIGHLIGHTS" });
}

async function updateFamiliarity(normalizedText: string, familiarity: Familiarity): Promise<void> {
  // await skillRepository.updateFamiliarityForText(normalizedText, familiarity);
  await notifyJobTabs({ type: "RELOAD_HIGHLIGHTS" });
}

async function updateTemperature(normalizedText: string, temperature: Temperature | ""): Promise<void> {
  // await skillRepository.updateTemperatureForText(normalizedText, temperature || undefined);
  await notifyJobTabs({ type: "RELOAD_HIGHLIGHTS" });
}

async function updateType(normalizedText: string, type: SkillType): Promise<void> {
  // await skillRepository.updateTypeForText(normalizedText, type);
  await notifyJobTabs({ type: "RELOAD_HIGHLIGHTS" });
}

async function updateSynonym(normalizedText: string, synonymSkillId?: string): Promise<void> {
  // await skillRepository.updateSynonymForText(normalizedText, synonymSkillId);
  await notifyJobTabs({ type: "RELOAD_HIGHLIGHTS" });
}