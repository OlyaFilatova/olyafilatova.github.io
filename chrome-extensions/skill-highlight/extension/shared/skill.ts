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

export function normalizeSkillText(text: string): string {
  const collapsed = text.trim().replace(/\s+/g, " ");
  return hasUppercaseMajority(collapsed) ? collapsed : collapsed.toLowerCase();
}

export function splitSkillList(text: string): string[] {
  return text
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}
