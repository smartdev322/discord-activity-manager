// This is the child process that manages the Discord Rich Presence

import { Client } from 'discord-rpc';
import { argv } from 'node:process';
import { Activities } from './Activities';

// Forces the application to be forked from a parent node process
if (process.send === undefined) {
  console.error('This process was not created properly and no changes have been made.\nPlease launch the application from the client.');
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

client.on('ready', () => {
  updateActivity(activity);
});
client.on('disconnect', () => {
  client.clearActivity();
  client.destroy();
  process.exit(0);
});

client.login({ clientId })
  .catch((err: Error) => {
    process.send({ error: err.stack }); 
    if (err.message == 'connection closed') process.exit(4007);
    process.exit(1000);
  });

process.on('message', (activity: any) => { updateActivity(JSON.parse(activity)) })
process.on('exit', () => {
  if (client) client.destroy();
});
process.on('disconnect', () => {
  if (client) {
    client.clearActivity();
    client.destroy();
  }
  process.exit(0);
});

function updateActivity(activity: Activities.Activity) {
  client.setActivity(activity).catch((err) => {
    //console.error(err.message);
    process.exit(err.code);
  });
}
