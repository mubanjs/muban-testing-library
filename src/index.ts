import { cleanup } from './render';

export * from '@testing-library/dom';
export * from './render';
export * from './queryByRef';

// If we're running in a test runner that supports afterEach then we'll
// automatically run cleanup after each test.
// This ensures that tests run in isolation from each other.
// If you don't like this, set the MTL_SKIP_AUTO_CLEANUP variable to 'true'.
if (typeof afterEach === 'function' && !process.env.MTL_SKIP_AUTO_CLEANUP) {
  afterEach(() => {
    cleanup();
  });
}
