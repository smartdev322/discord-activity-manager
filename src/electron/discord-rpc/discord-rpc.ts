/** discord-rpc.ts
 * A modification of the original discord-rpc connect function to improve how Discord API errors are communicated to the user
 */

import { Client, RPCClientOptions } from 'discord-rpc';

export class RPCClient extends Client {
  constructor(options: RPCClientOptions) {
    super(options);
  }

  /**
   * @override connect
   */
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
