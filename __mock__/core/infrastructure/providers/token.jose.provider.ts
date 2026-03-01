/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Mock for token.jose.provider to avoid ESM import issues with jose library in tests.
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
}

export const TokenJoseProvider = MockTokenProvider;
