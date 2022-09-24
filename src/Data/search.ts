import Fuse from 'fuse.js';
import { writeFile } from 'fs/promises';
import { Activities } from '../types/activities';
import { readFileSync } from 'fs';

interface FuseItem {
  item: Activities.Activity;
}

export class SearchManager {
  private fuse: Fuse<any>;
  private readonly config = {
    threshold: 0.3,
    ignoreLocation: true,
    keys: ['name', 'applicationId'],
  };

  constructor() {
    const titles = this.readFile(__dirname + '/titles.json');
    this.fuse = new Fuse(titles, this.config);
  }

  private readFile(path: string): Array<any> {
    const data = readFileSync(path, { encoding: 'utf-8' });
    return JSON.parse(data) || [];
  }

  private static async writeFile(path: string, data: JSON): Promise<void> {
    await writeFile(path, JSON.stringify(data), { encoding: 'utf-8' });
  }

  public updateList(data: Array<FuseItem>): void {
    this.fuse = new Fuse(data, this.config);
  }

  public async searchList(query: string): Promise<Array<FuseItem>> {
    return this.fuse.search(query) || [];
  }
}
