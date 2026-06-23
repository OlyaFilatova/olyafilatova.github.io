import fs from 'node:fs/promises';
import { join } from 'node:path';
import { Experience } from '../src/schemas/experience.ts';

async function loadAndParseExperience() {
  const dir =  join(process.cwd(), 'data/experience');
  const files = await fs.readdir(dir);

  const experiences = await Promise.all<Experience>(files.map(async file => {
    const fileContent = await fs.readFile(join(dir, file), { encoding: 'utf8' });
    const fileData = JSON.parse(fileContent);
    return Experience.parse(fileData);
  }));

  console.log(experiences);
  await fs.writeFile(join(process.cwd(), 'src/data/experience.ts'), `import { Experience } from '../schemas/experience.ts';

export const experience: Experience[] = ${JSON.stringify(experiences, undefined, 2)};
`)
}

loadAndParseExperience().then(() => console.log('Script finished.'), err => console.log('Script failed.', err));
