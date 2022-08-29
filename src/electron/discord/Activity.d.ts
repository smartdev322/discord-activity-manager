export namespace Activity {
  interface Struct {
    applicationId: string;
    name?: string;
    state?: string;
    details?: string;
    timestamp?: ActivityTimestamps;
    assets?: ActivityAssets;
  }

  interface ActivityTimestamps {
    start?: number,
    end?: number
  }

  interface ActivityAssets {
    largeImage?: string,
    largeImateText?: string,
    smallImage?: string,
    smallImageText?: string
  }
}
