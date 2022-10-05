# Discord Activity Manager

This is a cross-platform electron application that allows users easily modify their Discord game activity through the Discord Rich Presence API. 

# Features
## Key Features
* Easily make changes to your activity status, even while the activity is being broadcasted
* Quickly search through the saved list of activities

## In Progress
* Saving and modifying activities
* Localization support

# Technology Stack
### Backend
* Discord RPC (Discord.js)
* Electron/Node
* Fuse (Fuzzy Searches)
* TypeScript
### Frontend
* React/Next
* Tailwindcss

# Accessing the Source Code
## Prerequisites
You will need to have Node.js installed prior to continuing.

Download the source code and install the required packages by entering `npm install` into your terminal of choice.

## Available Commands
`npm run dev`
> Runs the Electron application with a local React server. This runs the local Next.js server at `http://localhost:3000` so you can edit the frontend code and have it instantly reflected on your screen.

`npm run lint`
> Styles and optimizes the code before performing a lint to ensure that the code types are valid.

`npm run export`
> Bundles the code into a distributable executive bundle. Currently only supports Windows and requires some kind of cleanup prior to distribution.

# Disclaimers
The user is still bound by any applicable Discord Terms of Service agreements while using this software. Please be considerate in what gets entered into the fields prior to sharing your status with the community. The author and contributors will not be liable for any disciplinary actions applied as a result of misuse of this software.
