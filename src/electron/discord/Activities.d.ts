export namespace Activities {
  interface Activity {
    applicationId: string;
    name?: string;
    state?: string;
    details?: string;
    timestamp?: ActivityTimestamps;
    assets?: ActivityAssets;
    party?: ActivityParty;
  }

  interface ActivityTimestamps {
    start?: number,
    end?: number
  }

  interface ActivityAssets {
    largeImageKey?: string,
    largeImageText?: string,
    smallImageKey?: string,
    smallImageText?: string
  }
  
  interface ActivityParty {
    id: string,
    size: PartySize
  }

  interface PartySize {
    currentSize: number,
    maxSize: number
  }
}
