import { useState } from "react";
import { notifyAddSynonymTriggered, notifyRemoveSynonymTriggered, notifySkillEditTriggered } from "../../../shared/notifications";
import { Familiarity, SkillAggregate, SkillType, Temperature } from "../../../shared/types";
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
  const [familiarity, setFamiliarity] = useState(skill.familiarity);
  const [temperature, setTemperature] = useState(skill.temperature);
  const [type, setType] = useState(skill.type);

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
            {/* <p><strong>Companies: {companyListLabel(skill)}</strong></p> */}
            <p><strong>Synonyms: {skill.synonymTexts.join(", ") || "None"}</strong></p>
          </div>
          <details className="links-accordion">
            <summary>Links to pages</summary>
            <div className="links">
              {skill.urls.map(url =>
              <div className="link-row">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className={urlsMatch(url, currentPageUrl) ? 'links__current': ''}>{url}</a>
              </div>)}
            </div>
          </details>
        </div>
        <div>
          <div className="controls">
            <SelectFilter
              label="Familiarity"
              options={FAMILIARITIES.map(familiarity => ({
                value: familiarity,
                text: familiarity
              }))}
              currentValue={familiarity}
              onChange={event => {
                setFamiliarity(event.target.value as Familiarity);
                void updateFamiliarity(skill.normalizedText, event.target.value as Familiarity);
              }}
             />

            <SelectFilter
              label="Temperature"
              options={TEMPERATURES.map(item => ({
                value: item,
                text: item
              }))}
              currentValue={temperature}
              onChange={event => {
                setTemperature(event.target.value as Temperature);
                void updateTemperature(skill.normalizedText, event.target.value as Temperature)
              }}
             />

            <SelectFilter
              label="Type"
              options={SKILL_TYPES.map(item => ({
                value: item,
                text: item
              }))}
              currentValue={type}
              onChange={event => {
                setType(event.target.value as SkillType);
                void updateType(skill.normalizedText, event.target.value as SkillType)
              }}
             />

            <SelectFilter
              label="Add synonym"
              options={[
                {value: "", text: "Select skill"},
                ...skillTexts
                  .filter(skillText => 
                    !skill.synonyms.includes(skillText.normalizedText) &&
                    skill.normalizedText !== skillText.normalizedText
                  )
                  .map(skillText => ({
                    value: skillText.normalizedText,
                    text: skillText.displayText
                  }))
              ]}
              currentValue={""}
              onChange={event => {
                void addSynonym(skill.normalizedText, event.target.value);
              }}
             />

            <SelectFilter
              label="Remove synonym"
              options={[
                {value: "", text: "Select skill"},
                ...skill.synonyms
                  .map(skillText => ({
                    value: skillText,
                    text: skillText
                  }))
              ]}
              currentValue={""}
              onChange={event => {
                if (event.target.value) {
                  void removeSynonym(skill.normalizedText, event.target.options[event.target.selectedIndex].text, event.target.value);
                }
              }}
             />
          </div>
        </div>
      </div>
    </article>
  )
}

function companyCountLabel(skill: SkillAggregate): string {
  return `${skill.companyCount} ${skill.companyCount === 1 ? "company" : "companies"}`;
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

async function updateFamiliarity(normalizedText: string, familiarity: Familiarity): Promise<void> {
  notifySkillEditTriggered({
    normalizedText,
    familiarity
  });
}

async function updateTemperature(normalizedText: string, temperature: Temperature): Promise<void> {
  notifySkillEditTriggered({
    normalizedText,
    temperature
  });
}

async function updateType(normalizedText: string, type: SkillType): Promise<void> {
  notifySkillEditTriggered({
    normalizedText,
    skillType: type
  });
}

async function addSynonym(normalizedText: string, synonymNormalizedText: string): Promise<void> {
  notifyAddSynonymTriggered({
    normalizedText: synonymNormalizedText,
    originNormalizedText: normalizedText,
  });
}


async function removeSynonym(normalizedText: string, synonymText: string, synonymNormalizedText: string): Promise<void> {
  notifyRemoveSynonymTriggered({
    displayText: synonymText,
    normalizedText: synonymNormalizedText,
    originNormalizedText: normalizedText,
  });
}
