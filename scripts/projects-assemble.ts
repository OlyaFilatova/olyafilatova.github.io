import fs from 'node:fs/promises';
import { join } from 'node:path';
import { MarkdownService } from '@olyafilatova.github.io/markdown-to-html/src/markdown/markdown.service.ts';

const languages = ['uk', 'en'];

async function getFileNames() {
  const dir = join(process.cwd(), 'data/projects');

  return await fs.readdir(dir);
}

async function loadProjects(fileNames: string[]) {
  const dir = join(process.cwd(), 'data/projects');

  const sources = await Promise.all(fileNames.map(async fileName => ({
    fileName,
    translations: await Promise.all(languages.map(async lang => ({
      lang,
      content: (await fs.readFile(join(dir, fileName, `${lang}.md`), {encoding: 'utf8'}))
    })))
  })));

  return await Promise.all<[[string, string, string], string][]>(sources.map(async ({
    fileName,
    translations
  }) => {
    return (await Promise.all(translations.map(async translation => {
      const text = new MarkdownService().convert(translation.content);
      return [[fileName, translation.lang, createNewName(fileName, translation.lang)], text] as [[string, string, string], string]
    })));
    
  }));
}

function createNewName(fileName: string, lang: string) {
  return `${fileName}/${lang}.html`;
}

async function storeProjectFiles(projects: [[string, string, string], string][][]) {
  const dirPath = join(process.cwd(), 'website/assets/projects');

  try {
    await fs.rm(dirPath, { recursive: true });
  } catch {}

  await Promise.all(projects.flat().map(async project => {
    await fs.mkdir(join(dirPath, project[0][0]), { recursive: true });

    await fs.writeFile(join(dirPath, project[0][2]), project[1]);
  }));
}

async function storeProjectsIndex(projects: [[string, string, string], string][][]) {
  const filePath = join(process.cwd(), 'website/data/projects-index.ts');
  
  const prevContent = await fs.readFile(filePath, {encoding: 'utf8'});
  
  const match = [...prevContent.matchAll(/export const bustCache = (\d+)/g)].map(el => el[1])[0] || '0';
  
  const bustCache = Number(match) + 1;

  await fs.writeFile(filePath, `
export const bustCache = ${bustCache};

export const index: {
  directory: string;
  translations: Record<string, string>
}[] = ${JSON.stringify(projects.map(project => ({
  directory: project[0][0][0],
  translations: project.reduce((prev, [[directory, lang, fileName]]) => {
    prev[lang] = fileName;
    return prev;
  }, {} as Record<string, string>)
})), undefined, 2)}
`);
}

getFileNames().then(async fileNames => {
  const projects = await loadProjects(fileNames);

  await storeProjectFiles(projects);
  await storeProjectsIndex(projects);
  
  console.log('Projects assemble script finished.')
}, err => console.log('Load projects step failed.', err));
