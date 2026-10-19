import type { ProjectReactionType } from '@looking-for-group/shared';

/**
 * The reactions a user can leave on a project, in the order they're listed.
 * The database stores these keys (not the emoji) so the emoji shown for each
 * one can change without a migration. The client maps each key to its emoji.
 */
export const PROJECT_REACTIONS: readonly ProjectReactionType[] = [
  'smile',
  'exclamation',
  'laugh',
  'fire',
  'thumbs-up',
];

/**
 * Checks that a value from a request is one of the allowed reactions
 *
 * @param value - The value to check
 * @returns true if the value is an allowed reaction key
 */
export const isProjectReaction = (value: unknown): value is ProjectReactionType =>
  typeof value === 'string' && (PROJECT_REACTIONS as readonly string[]).includes(value);
