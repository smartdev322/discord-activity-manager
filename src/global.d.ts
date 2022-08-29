declare global {
  interface Window {
    activityManager: {
      updateStatus: () => Promise<void>;
      disconnect: () => Promise<void>;
    };
  }
}

export { }
