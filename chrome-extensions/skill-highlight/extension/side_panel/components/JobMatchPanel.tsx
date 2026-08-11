interface JobMatchSkill {
  displayText: string;
  synonymTexts: string[];
}

interface JobFamiliarity {
  name: string;
  skills: JobMatchSkill[]
}

interface JobMatch {
  url: string;
  familiarities: JobFamiliarity[];
  temperatureSet: Record<string, number>;
}

export default function JobMatchPanel({ unknown_skills, jobMatches }: {
  unknown_skills: Record<string, number>;
  jobMatches: JobMatch[] | null;
}) {
  return (<>
    <div>
      <h2>Unknown skills from Top 10 Job matches</h2>
      <ul>
        {Object.entries(unknown_skills).sort((a, b) => b[1] - a[1]).map(skill => (
          <li>{skill[0]} ({skill[1]})</li>
        ))}
      </ul>
    </div>
    <section
      id="jobMatchesList"
      className="synonym-groups"
      aria-live="polite">{
        jobMatches === null ?
          <div className="empty">Click show job matches to calculate.</div> :
          jobMatches.length === 0 ?
            <div className="empty">No job matches found.</div> :
            jobMatches.map(match => (
              <article className="job-match">
                <div className="job-match__header">
                  <a
                    href={match.url}
                    target="_blank"
                    rel="noreferrer">{match.url}</a>
                </div>
                <h2>Job skill match</h2>
                {match.familiarities.map(familiarity => (
                  <details className="familiarity-accordion">
                    <summary>{familiarity.name} ({familiarity.skills.length})</summary>

                    <div className="job-skills-list">
                      <ul className={`job-match__${familiarity}__skills`}>
                        {familiarity.skills.map(skill => (
                          <li>{skill.displayText}{
                            skill.synonymTexts.length ?
                            <div>(${skill.synonymTexts.join(', ')})</div> :
                            <></>
                          }</li>
                        ))}
                      </ul>
                    </div>
                  </details>
                ))}
                <h2>Job temperature</h2>
                <ul>{
                Object.entries(match.temperatureSet).map(([temperature, temperatureLevel]) => (
                  <li>{temperature} = {temperatureLevel}</li>))
                }</ul>
              </article>
            ))
      }</section>
  </>)
}
