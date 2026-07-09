import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export async function getGitFileDate(filePath: string): Promise<Date> {
  try {
    const command = `git log -1 --format="%ci" -- "${filePath}"`;
    const { stdout } = await execAsync(command);
    
    if (!stdout.trim()) {
      throw new Error(`No commit history found for file ${filePath}.`);
    }
    
    return new Date(stdout.trim());
  } catch (error) {
    console.error(`Error fetching git date:`, error);
    throw error;
  }
}

