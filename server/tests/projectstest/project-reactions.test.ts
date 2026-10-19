import { describe, it, expect } from 'vitest';
import { isProjectReaction, PROJECT_REACTIONS } from '#config/project-reactions.ts';
import { transformProjectToReactions } from '#services/transformers/projects/parts/project-reactions.ts';

// The transformer imports nothing that touches the database, so no mocks are needed
describe('transformProjectToReactions', () => {
  it('returns an empty list when nobody has reacted', () => {
    expect(transformProjectToReactions({ projectReactions: [] })).toStrictEqual([]);
  });

  it('counts each reaction and skips unused ones', () => {
    const result = transformProjectToReactions({
      projectReactions: [
        { reaction: 'fire' },
        { reaction: 'smile' },
        { reaction: 'fire' },
        { reaction: 'fire' },
      ],
    });

    expect(result).toStrictEqual([
      { reaction: 'smile', count: 1 },
      { reaction: 'fire', count: 3 },
    ]);
  });

  it('lists reactions in the configured order, not the order they were added', () => {
    const result = transformProjectToReactions({
      projectReactions: [{ reaction: 'thumbs-up' }, { reaction: 'smile' }, { reaction: 'laugh' }],
    });

    expect(result.map((r) => r.reaction)).toStrictEqual(['smile', 'laugh', 'thumbs-up']);
  });

  it('ignores reaction keys that are no longer allowed', () => {
    const result = transformProjectToReactions({
      projectReactions: [{ reaction: 'retired-emoji' }, { reaction: 'fire' }],
    });

    expect(result).toStrictEqual([{ reaction: 'fire', count: 1 }]);
  });
});

describe('isProjectReaction', () => {
  it('accepts every allowed reaction', () => {
    for (const reaction of PROJECT_REACTIONS) {
      expect(isProjectReaction(reaction)).toBe(true);
    }
  });

  it('rejects anything else', () => {
    expect(isProjectReaction('🔥')).toBe(false);
    expect(isProjectReaction('')).toBe(false);
    expect(isProjectReaction(undefined)).toBe(false);
    expect(isProjectReaction(5)).toBe(false);
  });
});
