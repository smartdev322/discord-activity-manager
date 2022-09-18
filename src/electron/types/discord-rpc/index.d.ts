import 'discord-rpc';

/* Fills in the missing types from @types/discord-rpc */
declare module 'discord-rpc' {
  interface Client extends BaseClient {
    _connectPromise?: Promise<Client> | undefined;
    _expecting?: Map<string, ExePromise>;
    clientId?: string;
    accessToken?: string | undefined;
    transport?: IPCTransport;
  }

  interface IPCTransport {
    once(msg: string, callback: (reason: Error) => void): Promise<Client>; //IPCTransport (ipc.js)
    connect(): Promise<void>; //IPCTransport (ipc.js)
  }

  interface TransportRejection {
    code: number;
    message: string;
  }

  interface ExePromise {
    resolve(): Promise<void>;
    reject(reason?: Error): Promise<void>;
  }
}
