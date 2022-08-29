// This is the child process that manages the Discord Rich Presence

import { Client } from 'discord-rpc';

// Forces the application to be forked from a parent node process
if (process.send === undefined) {
  console.error('This process was not created properly and no changes have been made.\nPlease launch the application from the client.');
  process.exit(1);
}

// DEBUG: Displays information about both the child and parent process IDs
//console.log(`Child process (${process.pid}) created successfully under parent (${process.ppid})`);

// Sets the user's current activity
const applicationId = '';
const client = new Client({ transport: 'ipc' });

client.on('ready', () => {
  updateActivity();
})
client.on('disconnect', () => {
  client.clearActivity();
  client.destroy();
  process.exit(0);
})

client.login({ clientId: applicationId }).catch((err: Error) => { process.send(err) })
process.on('error', (err) => { console.error(err) })
process.on('message', () => { updateActivity() })
process.on('exit', () => {
  if (client) client.destroy();
});
process.on('disconnect', () => {
  client.clearActivity();
  client.destroy();
  process.exit(0);
});

function updateActivity() {
  client.setActivity({});
}
