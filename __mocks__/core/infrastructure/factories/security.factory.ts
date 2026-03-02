/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Mock for security.factory to avoid ESM import issues with jose library in tests.
 */
export class MockTokenProvider {
  async sign(payload: any): Promise<string> {
    return 'mock-token-' + JSON.stringify(payload).substring(0, 10);
  }

  async verify(token: string): Promise<any> {
    if (token === 'mock-token-invalid') {
      throw new Error('Invalid token');
    }
    return { userId: '550e8400-e29b-41d4-a716-446655440000' };
  }

  getAccessExpirationInSeconds(): number {
    return 3600;
  }

  getRefreshExpirationInSeconds(): number {
    return 604800;
  }
}

export class MockHashProvider {
  async hash(password: string): Promise<string> {
    return 'hashed:' + password;
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return hash === 'hashed:' + password;
  }
}

const tokenProvider = new MockTokenProvider();
const hashProvider = new MockHashProvider();

export function makeTokenProvider() {
  return tokenProvider;
}

export function makeHashProvider() {
  return hashProvider;
}
