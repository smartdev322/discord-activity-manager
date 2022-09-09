import { Client, RPCClientOptions } from 'discord-rpc';

/** MODIFIED connect function from 'discord-rpc' to provide better error reporting */
export class RPCClient extends Client {
  constructor(options: RPCClientOptions) {
    super(options);
  }

  public connect(clientId: string): Promise<Client> {
    if (this._connectPromise) {
      return this._connectPromise;
    }
    this._connectPromise = new Promise((resolve, reject) => {
      this.clientId = clientId;
      const timeout: NodeJS.Timeout = setTimeout(() => reject(new Error('RPC_CONNECTION_TIMEOUT')), 10e3);
      timeout.unref();
      this.once('connected', () => {
        clearTimeout(timeout);
        resolve(this);
      });
      this.transport.once('close', (err: any) => {
        console.log(err);
        this._expecting.forEach((e) => {
          e.reject(err);
        });
        this.emit('disconnected');
        reject(err);
      });
      this.transport.connect().catch(reject);
    });
    return this._connectPromise;
  }
}
