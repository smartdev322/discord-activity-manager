/** ErrorMsg.ts
 * Returns a string based on the error code provided
 */

interface ErrorCodeTable {
  [key: number]: string;
}

export default function ErrorMsg(code: number): string {
  const message: ErrorCodeTable = {
    100: 'Discord Error',
    101: 'Process already active',
    102: '',
    103: 'Missing data',
    105: 'Rate limit',
    1000: 'Discord is not open',
    4000: 'Invalid application ID',
    4001: 'Invalid origin',
    4002: 'Rate limited',
    4003: 'Token revoked',
    4004: 'Invalid version',
    4005: 'Invalid encoding',
    4006: 'Missing permissions',
    4007: 'Invalid application ID',
    4008: 'Invalid OAuth2/origin',
    4009: 'Invalid OAuth2 token',
    4010: 'Invalid user',
    5000: 'General OAuth2 error',
  };

  return message[code] || 'Unknown';
}
