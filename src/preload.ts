// All of the Node.js APIs are available in the preload process.
import { Activities } from './types/activities';
import { contextBridge, ipcRenderer } from 'electron';

interface FuseItem {
  item: Activities.Activity;
}

// It has the same sandbox as a Chrome extension.
/*window.addEventListener("DOMContentLoaded", () => {});*/

// The IPC needed to allow the React renderer to use Node process commands
contextBridge.exposeInMainWorld('activityManager', {
  broadcastStatus: async (activity: Activities.Activity): Promise<number> => {
    return await ipcRenderer.invoke('pt:broadcastStatus', activity);
  },
  updateStatus: async (activity: Activities.Activity): Promise<number> => {
    return await ipcRenderer.invoke('pt:updateStatus', activity);
  },
  disconnect: async (): Promise<void> => {
    ipcRenderer.invoke('pt:disconnect');
  },
});

//
contextBridge.exposeInMainWorld('searchManager', {
  search: async (search: string): Promise<Array<FuseItem>> => {
    return await ipcRenderer.invoke('pt:search', search);
  },
});
