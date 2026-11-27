import { describe, expect, it } from 'vitest';
import { connectorCatalog } from './connectorCatalog';

describe('connector catalog', () => {
  it('contains only the services named for ALINEO and starts with no connections', () => {
    expect(connectorCatalog.map(({ id }) => id)).toEqual([
      'gmail',
      'google-calendar',
      'google-workspace',
      'ticktick',
    ]);
    expect(connectorCatalog.every((entry) => entry.decisionNeeded.length > 0)).toBe(true);
  });
});
