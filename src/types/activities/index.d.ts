export namespace Activities {
  export interface Activity {
    applicationId: string;
    name?: string;
    state?: string;
    details?: string;
    startTimestamp?: number;
    endTimestamp?: number;
    assets?: ActivityAssets;
    party?: PartySize;
    buttons?: Array<Buttons>;
  }

  /*
  interface ActivityTimestamps {
    start?: number;
    end?: number;
  }*/

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

  interface Buttons {
    label: string;
    url: string;
  }
}
