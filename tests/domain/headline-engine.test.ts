import { describe, expect, it } from 'vitest';
import { validateHeadline } from '../../src/domain/headline-engine';

describe('validateHeadline', () => {
  it('accepts a reviewed headline option', () => {
    expect(validateHeadline('검수된 정확한 제목', ['검수된 정확한 제목'])).toEqual({ valid: true, message: '' });
  });

  it.each(['충격', '무조건', '100%'])('rejects overclaiming phrase %s', (phrase) => {
    expect(validateHeadline(`${phrase} 확인`, [`${phrase} 확인`]).valid).toBe(false);
  });

  it('rejects a headline outside the reviewed options', () => {
    expect(validateHeadline('다른 제목', ['검수된 제목']).message).toContain('검수된');
  });
});
