// This is the parent process responsible for creating and updating the child process

import { ChildProcess, fork } from 'node:child_process';
import { Activity } from './Activity';
export class ActivityManager {
  private activity: Activity.Struct;
  protected activityProcess: ChildProcess | null;

  constructor() {
    this.activity = {
      applicationId: ''
    };
    this.activityProcess = null;
  }

  public createActivity(activity: Activity.Struct) {
    // Stop if an activity is already active
    if (this.activityProcess && this.activityProcess.exitCode === null) {
      console.log(`Activity process (${this.activityProcess.pid}) is still active and a new one will not be created until it is closed.`);
      return;
    }

    // Creates a fork
    this.activityProcess = fork('./dist/discord/ActivityProcess');


    this.activityProcess.on('exit', (code: number) => { console.log(`Process ended with code ${code}`) });
    this.activityProcess.on('message', (msg: string | Activity.Struct) => { console.log(msg) });
    this.activityProcess.on('error', (err: Error) => { console.error(err) });
  }

  private sendActivity() {
    if (!this.activityProcess) return;
    this.activityProcess.send('livecheck');
  }

  public disconnect() {
    if (!this.activityProcess) return;
    this.activityProcess.disconnect();
  }
}
