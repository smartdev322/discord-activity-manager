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

  public async activityLauncher(
    activity: Activities.Activity
  ): Promise<number> {
    // Disconnects the existing activity if it's still active
    if (this.activityProcess && this.activityProcess.exitCode === null) {
      //console.log(`Disconnecting currently active process (${this.activityProcess.pid})`);
      if (!this.disconnect()) {
        // If the existing process cannot be disconnected
        return 101;
      }
    }

    // Data check
    if (!ActivityValidation.validActivity(activity)) return 103;

    // Remove empty fields and update the user's activity
    await this.createActivity(prune(activity));

    if (this.activityProcess) {
      this.activityProcess.on('exit', (code: number) => {
        console.log(`Process exited with code ${code}`);
      });
      this.activityProcess.on(
        'message',
        (msg: string | Activities.Activity) => {
          if (msg !== 'ptStatusOK') {
            console.log(msg);
          }
        }
      );
      this.activityProcess.on('error', (err: Error) => {
        console.error(err);
      });

      return new Promise((resolve) => {
        this.activityProcess.on('exit', (code: number) => {
          resolve(code);
        }) || resolve(0);
      });
    }

    return 0;
  }

  public async updateActivity(activity: Activities.Activity): Promise<number> {
    if (!ActivityValidation.validActivity(activity)) return 103;

    if (!this.activityProcess) {
      return await this.activityLauncher(prune(activity));
    }

    this.activityProcess.send(JSON.stringify(prune(activity)));
    return 0;
  }

  // Creates a fork
  private async createActivity(activity: Activities.Activity): Promise<void> {
    this.activityProcess = fork(`${__dirname}/ActivityProcess`, [
      JSON.stringify(activity),
    ]);
  }

  /**
   * Creates a request to clear the user's discord status and closes the child process.
   * @returns boolean representing if the signal was successfully sent
   */
  public disconnect(): boolean {
    if (!this.activityProcess) return false;
    this.activityProcess.disconnect();
    return true;
  }
}
