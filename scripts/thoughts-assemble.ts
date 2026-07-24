import fs from 'node:fs/promises';
import { join } from 'node:path';
import type { ThoughtsIndex } from '../src/schemas/knowledge-source.ts';
import { KnowledgeSource } from '../src/schemas/knowledge-source.ts';
import { getGitFileDate } from './helpers/git-file-date.ts';

function defaultdict<T>(defaultFactory: () => T) {
  return new Proxy({}, {
    get: (target: Record<string, T>, prop: string) => {
      // Return existing property or initialize with defaultFactory
      if (prop !== 'toJSON' && !(prop in target)) {
        target[prop] = defaultFactory();
      }
      return target[prop];
    }
  });
}

async function loadThoughts() {
  const dir =  join(process.cwd(), 'data/knowledge-sources');

  const sourceNames = (await fs.readFile(join(dir, 'list.txt'), {encoding: 'utf8'})).split('\n').filter(Boolean).reverse();

  return await Promise.all<KnowledgeSource>(sourceNames.map(async file => {
    const filePath = join(dir, file);
    const fileContent = await fs.readFile(filePath, { encoding: 'utf8' });
    const date = await getGitFileDate(filePath);
    const fileData = JSON.parse(fileContent);
    const source = KnowledgeSource.parse(fileData);
    source.date = date;
    return source;
  }));
}

function createThoughtsIndex(sources: KnowledgeSource[]) {
  const index: ThoughtsIndex = sources.map(source => ({
    categories: source.categories || [],
    status: source.status,
    kind: source.kind,
    access: source.access
  })).reduce((prev, curr, idx) => {
    const categories = (curr.categories.length) ? curr.categories : ['Non'];
    
    categories.forEach(category => prev.categories[category].push(idx))

    prev.access[curr.access].push(idx)
    prev.kind[curr.kind].push(idx)
    prev.status[curr.status].push(idx)

    return prev;
  }, {
    count: sources.length,
    categories: defaultdict<number[]>(() => []),
    kind: defaultdict<number[]>(() => []),
    access: defaultdict<number[]>(() => []),
    status: defaultdict<number[]>(() => [])
  });

  return index;
}

async function storeThoughtsJSON(sources: KnowledgeSource[]) {
  const dirPath = join(process.cwd(), 'src/assets/knowledge-sources');

  const files = await fs.readdir(dirPath);
  await Promise.all(files.map(file => 
    fs.unlink(join(dirPath, file))
  ));
  await fs.mkdir(dirPath, { recursive: true });
  await Promise.all(sources.map((source, idx) => fs.writeFile(join(dirPath, `${idx}.json`), JSON.stringify(source, undefined))));
}

async function storeThoughtsIndex(index: ThoughtsIndex) {
  const filePath = join(process.cwd(), 'src/data/knowledge-sources-index.ts');

  const prevContent = await fs.readFile(filePath, {encoding: 'utf8'});

  const match = [...prevContent.matchAll(/export const bustCache = (\d+)/g)].map(el => el[1])[0] || '0';

  const bustCache = Number(match) + 1;

  await fs.writeFile(filePath, `
import type { ThoughtsIndex } from '../schemas/knowledge-source.ts';

export const bustCache = ${bustCache};

export const index: ThoughtsIndex = ${JSON.stringify(index, undefined, 2)}
`);
}

loadThoughts().then(async sources => {
  await storeThoughtsJSON(sources);
  await storeThoughtsIndex(createThoughtsIndex(sources));
  
  console.log('Thoughts assemble script finished.')
}, err => console.log('Load thoughts step failed.', err));
