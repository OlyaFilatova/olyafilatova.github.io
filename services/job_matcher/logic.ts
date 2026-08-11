
// function getJobMatches(): JobMatch[] {
//   const category = elements.jobCategoryFilter?.value ?? "";

//   const skills: Array<JobMatchSkill & { mentions: Pick<SkillMention, 'company' | 'url'>[]; }>
//     = aggregates.filter(aggregate => !category || aggregate.categories.includes(category)).map((aggregate) => ({
//     displayText: aggregate.displayText,
//     familiarity: aggregate.familiarity,
//     temperature: aggregate.temperature,
//     type: aggregate.type,
//     synonymTexts: aggregate.synonymTexts,
//     mentions: aggregate.mentions.filter(mention => !mention.ignored && (!category || mention.category == category)).map(mention => ({
//       company: mention.company,
//       url: mention.url
//     }))
//   }));

//   const jobs: JobMatch[] = Object.entries(skills.reduce((prev, { mentions, ...skill}) => {
//     mentions.forEach(({ url }) => {
//       if (!(url in prev)) {
//         prev[url] = {
//           score: 0,
//           skills: [],
//           application_known_skills: [],
//           application_unknown_skills: [],
//           approach_known_skills: [],
//           approach_unknown_skills: [],
//           temperatureSet: TEMPERATURES.reduce((prev, temperature) => ({
//             ...prev,
//             [temperature]: 0
//           }), {} as Record<Temperature, number>)
//         };
//       }

//       if (prev[url].skills.map(({ displayText }) => displayText).includes(skill.displayText)) {
//         return prev;
//       }

//       prev[url].skills.push(skill);

//       if (skill.type == 'Application') {
//         if (skill.familiarity != 'unknown') {
//           prev[url].application_known_skills.push(skill);
//         } else {
//           prev[url].application_unknown_skills.push(skill);
//         }
//       } else {
//         if (skill.familiarity != 'unknown') {
//           prev[url].approach_known_skills.push(skill);
//         } else {
//           prev[url].approach_unknown_skills.push(skill);
//         }
//       }

//       const scoreChange = FAMILIARITY_SCORES[skill.familiarity] ?? 0;

//       prev[url].score += scoreChange;
//       prev[url].temperatureSet[skill.temperature] += 1;
//     })
//     return prev;
//   }, {} as Record<string, Omit<JobMatch, 'url'>>)).map(([url, data]) => ({
//     url,
//     ...data
//   }));

//   return jobs.sort((a, b) => {
//     return a.application_unknown_skills.length - b.application_unknown_skills.length;
//   }).sort((a, b) => {
//     const unknown_application_skills_diff = a.application_unknown_skills.length - b.application_unknown_skills.length;
//     if (unknown_application_skills_diff !== 0) {
//       return unknown_application_skills_diff;
//     }
//     return b.application_known_skills.length - a.application_known_skills.length;
//   }).sort((a, b) => {
//     const unknown_application_skills_diff = a.application_unknown_skills.length - b.application_unknown_skills.length;
//     if (unknown_application_skills_diff !== 0) {
//       return unknown_application_skills_diff;
//     }
//     const known_application_skills_diff = b.application_known_skills.length - a.application_known_skills.length;
//     if (known_application_skills_diff !== 0) {
//       return known_application_skills_diff;
//     }
//     const unknown_approach_skills_diff = a.approach_unknown_skills.length - b.approach_unknown_skills.length;
//     if (unknown_approach_skills_diff !== 0) {
//       return unknown_approach_skills_diff;
//     }
//     const known_approach_skills_diff = b.approach_known_skills.length - a.approach_known_skills.length;
//     if (known_approach_skills_diff !== 0) {
//       return known_approach_skills_diff;
//     }

//     return b.score - a.score;
//   });
// }


// function getTop10JobsUnknowns(jobMatches: JobMatch[]) {
//   return jobMatches.slice(0, 11).reduce((prev, jobMatch) => {
//     jobMatch.skills.filter(skill => skill.familiarity == 'unknown')
//       .forEach(skill => {
//         const key = skill.type == 'Application' ? 'application' : 'approach';
//         const text = skill.displayText;
//         if (!(text in prev[key])) {
//           prev[key][text] = 0;
//         }

//         prev[key][text] += 1;
//       })

//     return prev;
//   }, {
//     application: {},
//     approach: {}
//   } as {
//     application: Record<string, number>,
//     approach: Record<string, number>
//   });
// }
