import '@testing-library/jest-dom/vitest';

// jsdom has no 2D canvas renderer; production uses the native browser context.
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  configurable: true,
  value: () => null,
});
