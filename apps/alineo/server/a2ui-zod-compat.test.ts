import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { getKnownSchemaKeys } from '@a2ui/web_core/resolution';

describe('A2UI schema inspection with the audited Zod version', () => {
  it('unwraps a Zod 4 transform without throwing on the removed ZodEffects class', () => {
    const transformed = z.object({ allowed: z.string() }).transform((value) => value);

    expect(Array.from(getKnownSchemaKeys(transformed as never) ?? [])).toEqual(['allowed']);
    expect(getKnownSchemaKeys(z.string().optional() as never)).toBeNull();
  });
});
