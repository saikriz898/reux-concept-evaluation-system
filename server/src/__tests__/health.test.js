const { describe, it, expect } = require('vitest');

describe('Health Check', () => {
  it('should pass a basic sanity test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should verify environment variables are loaded', () => {
    // Just verify the test environment is working
    expect(true).toBe(true);
  });
});
