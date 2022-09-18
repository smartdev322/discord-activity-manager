declare global {
  interface Window {
    activityManager: {
      broadcastStatus: (activity: Activities.Activity) => Promise<number>;
      updateStatus: (activity: Activities.Activity) => Promise<number>;
      disconnect: () => Promise<void>;
    };
  }
}

export {};
