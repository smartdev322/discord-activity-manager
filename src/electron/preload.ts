// All of the Node.js APIs are available in the preload process.
import { contextBridge, ipcRenderer } from "electron";

// It has the same sandbox as a Chrome extension.
/*window.addEventListener("DOMContentLoaded", () => {
});*/

// The IPC needed to allow the React renderer to use Node process commands
contextBridge.exposeInMainWorld('activityManager', {
  updateStatus: async (): Promise<void> => {
    ipcRenderer.invoke('pt:updateStatus');
  },
  disconnect: async (): Promise<void> => {
    ipcRenderer.invoke('pt:disconnect');
  }
})