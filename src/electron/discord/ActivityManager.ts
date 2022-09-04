// This is the parent process responsible for creating and updating the child process

import { ChildProcess, fork } from 'node:child_process';
import { Activities } from './Activities';
import { ActivityValidation } from './ActivityValidation';

export class ActivityManager {
  private activityProcess: ChildProcess | null;
  private userUpdates: number;

  constructor() {
    this.activityProcess = null;
    this.userUpdates = 0;
  }

  public async activityLauncher(activity: Activities.Activity): Promise<number> {
    // Stop if an activity is already active
    if (this.activityProcess && this.activityProcess.exitCode === null) {
      console.log(`Activity process (${this.activityProcess.pid}) is still active and a new one will not be created until it is closed.`);
      return (101);
    }

    const validData: boolean = ActivityValidation.validActivity(activity);
    if (!validData) {
      console.log("The provided activity contains missing or invalid data");
      return (103);
    }

    if (this.userUpdates > 20) {
      console.log('Too many consecutive requests made in the last 20 seconds');
      return (105);
    }

    console.log(activity);

    await this.createActivity(activity);

    if (this.activityProcess) {
      this.activityProcess.on('exit', (code: number) => { console.log(`Process ended with code ${code}`) });
      this.activityProcess.on('message', (msg: string | Activities.Activity) => { console.log(msg) });
      this.activityProcess.on('error', (err: Error) => { console.error(err) });
    }
    return (0);
  }

  public async updateActivity(activity: Activities.Activity): Promise<number> {
    if (!this.activityProcess) {
      console.error('The process has not been launched.');
      this.activityLauncher(activity);
    }

    this.userUpdates++;
    return (0);
  }

  // Creates a fork
  private async createActivity(activity: Activities.Activity): Promise<void> {
    this.activityProcess = fork('./dist/discord/ActivityProcess', [JSON.stringify(activity)]);
    this.userUpdates++;
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
