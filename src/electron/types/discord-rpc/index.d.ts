import 'discord-rpc';

/* Fills in the missing types from @types/discord-rpc */
declare module 'discord-rpc' {
  interface Client extends BaseClient {
    _connectPromise?: Promise<any>;
    _expecting?: Map<any, any>;
    clientId?: string;
    accessToken?: string | undefined;
    transport?: any;
  }

  interface TransportRejection {
    code: number,
    message: string
  }
}
