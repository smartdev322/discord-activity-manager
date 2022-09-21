export namespace Activities {
  export interface Activity {
    applicationId: string;
    name?: string;
    state?: string;
    details?: string;
    timestamp?: ActivityTimestamps;
    assets?: ActivityAssets;
    party?: PartySize;
  }

  interface ActivityTimestamps {
    start?: number;
    end?: number;
  }

  interface ActivityAssets {
    largeImageKey?: string;
    largeImageText?: string;
    smallImageKey?: string;
    smallImageText?: string;
  }

  /* May be used in the future
  interface ActivityParty {
    id?: string;
    size?: PartySize;
  }
  */

  interface PartySize {
    currentSize: number;
    maxSize: number;
  }
}
