import { writeFile, readFile } from 'fs/promises';

interface CompareElement {
  name: string;
}

export class Files {
  public static async readFile(path: string): Promise<JSON> {
    const data = await readFile(path, { encoding: 'utf-8' });
    return JSON.parse(data) || {};
  }

  public static async writeFile(path: string, data: []): Promise<void> {
    await writeFile(path, JSON.stringify(data.sort(this.compare)), {
      encoding: 'utf-8',
    });
  }

  private static compare(a: CompareElement, b: CompareElement): number {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  }
}
