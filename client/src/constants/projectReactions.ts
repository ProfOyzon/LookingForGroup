import type { ProjectReactionType } from '@looking-for-group/shared';

export interface ProjectReactionOption {
  /** Key the server stores for this reaction */
  reaction: ProjectReactionType;
  /** Native Unicode emoji shown for it */
  emoji: string;
  /** Spoken/tooltip name */
  label: string;
}

/**
 * The reactions a user can pick from, in the order they're shown. Typed with
 * ProjectReactionType so adding a reaction to the shared type without listing
 * it here (or the reverse) is a compile error.
 */
export const PROJECT_REACTIONS: readonly ProjectReactionOption[] = [
  { reaction: 'smile', emoji: '🙂', label: 'Smile' },
  { reaction: 'exclamation', emoji: '❗', label: 'Exclamation' },
  { reaction: 'laugh', emoji: '😂', label: 'Laugh' },
  { reaction: 'fire', emoji: '🔥', label: 'Fire' },
  { reaction: 'thumbs-up', emoji: '👍', label: 'Thumbs up' },
];

export const PROJECT_REACTION_BY_KEY: Record<ProjectReactionType, ProjectReactionOption> =
  Object.fromEntries(PROJECT_REACTIONS.map((option) => [option.reaction, option])) as Record<
    ProjectReactionType,
    ProjectReactionOption
  >;
