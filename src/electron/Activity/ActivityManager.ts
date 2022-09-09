// This is the parent process responsible for creating and updating the child process

import { ChildProcess, fork } from 'node:child_process';
import { Activities } from '../types/activities';
import { ActivityValidation } from './ActivityValidation';
import { prune } from './ActivityPruner';

export class ActivityManager {
  private activityProcess: ChildProcess | null;

  constructor() {
    this.activityProcess = null;
  }

  public async activityLauncher(activity: Activities.Activity): Promise<number> {

    /* Early checks to prevent issues later on */
    // Stop if we already have an activity bring broadcasted
    if (this.activityProcess && this.activityProcess.exitCode === null) {
      console.log(`Activity process (${this.activityProcess.pid}) is still active and a new one will not be created until it is closed.`);
      this.activityProcess.kill(0);
      //return (101);
    }

    const validData: boolean = ActivityValidation.validActivity(activity);
    if (!validData) {
      console.log("The provided activity contains missing or invalid data");
      return (103);
    }

    await this.createActivity(prune(activity));

    if (this.activityProcess) {
      this.activityProcess.on('close', (code: number, signal: NodeJS.Signals) => {console.log(`Process closed with code ${code} and signal ${signal}`)})
      this.activityProcess.on('exit', (code: number) => { console.log(`Process exited with code ${code}`) });
      this.activityProcess.on('message', (msg: string | Activities.Activity) => { console.log(msg) });
      this.activityProcess.on('error', (err: Error) => { console.error(err) });
    }

    return (new Promise(resolve => {
      this.activityProcess.on('exit', (code: number) => { resolve(code) }) || resolve(0);
    }));
  }

  public async updateActivity(activity: Activities.Activity): Promise<number> {
    let exitCode: number | string = 0;
    const validData: boolean = ActivityValidation.validActivity(activity);
    if (!validData) {
      console.log("The provided activity contains missing or invalid data");
      return (103);
    }

    if (!this.activityProcess) {
      console.error('The process has not been launched.');
      exitCode = await this.activityLauncher(prune(activity));
    }
    else {
      this.activityProcess.send(JSON.stringify(prune(activity)));
    }
    return (0);
  }

  // Creates a fork
  private async createActivity(activity: Activities.Activity): Promise<void> {
    this.activityProcess = fork('./dist/discord/ActivityProcess', [JSON.stringify(activity)]);
  }

  /**
   * Creates a request to clear the user's discord status and closes the child process.
   * @returns boolean representing if the signal was successfully sent
   */
  public disconnect(): boolean {
    if (!this.activityProcess) return (false);
    this.activityProcess.disconnect();
    return (true);
  }
}
