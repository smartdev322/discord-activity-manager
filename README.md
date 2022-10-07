# Discord Activity Manager

The Discord Activity Manager is an easy-to-use, cross-platform application that allows users to easily share their Discord game activity through the Discord Rich Presence API (via Discord.js/Discord-RPC).

# Features
## Key Features
* Easily make changes to your activity status, even while the activity is being broadcasted
* Quickly swap between the standard game and rich presence statuses
* Search through a locally saved list of activities

## In Progress
* Saving and modifying the list of user-generated activites for easy access
* Localization support

# Technology Stack
This program was written in Typescript and runs off an Electron/Node backend with a static React frontend from Next.js.

### Backend
* Electron/Node
* TypeScript
* Discord RPC (Discord.js)
* Fuse (Fuzzy Searches)
### Frontend
* React/Next
* Tailwindcss
* Prettier

# Accessing the Source Code
## Prerequisites
You will need to have Node.js installed and access to a terminal prior to continuing.
You can install the required packages by entering `npm install` into the terminal.

## Available Commands
`npm run dev`
> Runs the Electron application with a local React server. This runs the local Next.js server at `http://localhost:3000` so you can edit the frontend code and have it instantly reflected on your screen.

`npm run lint`
> Styles and optimizes the code before performing a lint to ensure that the code types are valid.

`npm run export`
> Bundles the code into a distributable executive bundle. Currently only supports Windows and requires some kind of cleanup prior to distribution.

# Disclaimers
The user is still bound by any applicable Discord Terms of Service agreements while using this program. Please be considerate in what gets entered into the fields prior to sharing your status with the community. The author and contributors will not be liable for any disciplinary actions applied as a result of misuse of this software.
