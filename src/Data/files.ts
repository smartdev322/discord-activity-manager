import { writeFile, readFile } from 'fs/promises';

export class Files {
  static async readFile(path: string): Promise<JSON> {
    const data = await readFile(path, { encoding: 'utf-8' });
    return JSON.parse(data) || {};
  }

  static async writeFile(path: string, data: JSON): Promise<void> {
    await writeFile(path, JSON.stringify(data), { encoding: 'utf-8' });
  }
}
