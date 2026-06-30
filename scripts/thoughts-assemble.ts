import fs from 'node:fs/promises';
import { join } from 'node:path';
import { KnowledgeSource } from '../src/schemas/knowledge-source.ts';

async function loadAndParseExperience() {
  const dir =  join(process.cwd(), 'data/knowledge-sources');

  const sourceNames = (await fs.readFile(join(dir, 'list.txt'))).toString().split('\n').filter(Boolean); // ls *.json > list.txt

  const sources = await Promise.all<KnowledgeSource>(sourceNames.map(async file => {
    const fileContent = await fs.readFile(join(dir, file), { encoding: 'utf8' });
    const fileData = JSON.parse(fileContent);
    return KnowledgeSource.parse(fileData);
  }));

  await fs.writeFile(join(process.cwd(), 'src/data/knowledge-sources.ts'), `import { KnowledgeSource } from '../schemas/knowledge-source.ts';

export const knowledgeSources: KnowledgeSource[] = ${JSON.stringify(sources, undefined, 2)};
`)
}

loadAndParseExperience().then(() => console.log('Script finished.'), err => console.log('Script failed.', err));
