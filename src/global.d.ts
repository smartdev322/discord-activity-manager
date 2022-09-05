declare global {
  interface Window {
    activityManager: {
      broadcastStatus: (activity: any) => Promise<number>;
      updateStatus: (activity: any) => Promise<number>;
      disconnect: () => Promise<void>;
    };
  }
}

export { }
