/** ActivityProcess.ts
 * This is the child process that manages the Discord Rich Presence
 */

import { argv } from 'node:process';
import { Activities } from '../types/activities';
import { RPCClient as Client } from '../discord-rpc/discord-rpc';
import { TransportRejection } from 'discord-rpc';

// Forces the application to be forked from a parent node process
if (process.send === undefined) {
  console.error(
    'This process was not created properly and no changes have been made.\nPlease launch the application from the client.'
  );
  process.exit(1);
}

if (process.argv.length < 2) {
  console.error('Missing arguments');
}

// DEBUG: Displays information about both the child and parent process IDs
//console.log(`Child process (${process.pid}) created successfully under parent (${process.ppid})`);

// Sets the user's current activity
const activity: Activities.Activity = JSON.parse(argv[2]);
const clientId = activity.applicationId;

const client = new Client({ transport: 'ipc' });
client.login({ clientId }).catch((reject: TransportRejection) => {
  if (reject.message === 'Error: could not connect') {
    process.exit(1000);
  }
  process.exit(reject.code || 1000);
});
client.on('ready', () => {
  updateActivity(activity);
});
client.on('disconnect', () => {
  client.clearActivity();
  client.destroy();
  process.exit(0);
});

process.on('message', (activity: string) => {
  updateActivity(JSON.parse(activity));
});
process.on('disconnect', () => {
  client.clearActivity();
  client.destroy();
  process.exit(0);
});
process.on('exit', () => {
  client.destroy();
});

function updateActivity(activity: Activities.Activity) {
  client
    .setActivity(activity)
    .then(() => {
      process.send('ptStatusOK');
    })
    .catch((err) => {
      process.exit(err.code);
    });
}
