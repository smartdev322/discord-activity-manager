declare global {
  interface Window {
    activityManager: {
      updateStatus: (activity: any) => Promise<number>;
      disconnect: () => Promise<void>;
    };
  }
}

export { }
