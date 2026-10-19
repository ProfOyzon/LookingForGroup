import { useSyncExternalStore } from 'react';
import type { ProjectReactionCount, ProjectReactionType } from '@looking-for-group/shared';
import {
  addProjectReaction,
  deleteProjectReaction,
  getMyProjectReactions,
} from '../api/users';
import { PROJECT_REACTIONS } from '../constants/projectReactions';

/**
 * Shared state for project reactions, so every card on the page uses one
 * request for "which reactions are mine" and a reaction added on one card is
 * reflected everywhere that project appears.
 *
 * - mine: the reactions the logged-in user has left, per project
 * - counts: counts changed by this user since the page loaded, per project.
 *   A project with no entry here shows the counts it was loaded with.
 */
interface ReactionState {
  mine: ReadonlyMap<number, ReadonlySet<ProjectReactionType>>;
  counts: ReadonlyMap<number, readonly ProjectReactionCount[]>;
  loaded: boolean;
}

let state: ReactionState = { mine: new Map(), counts: new Map(), loaded: false };
const listeners = new Set<() => void>();

const setState = (next: Partial<ReactionState>) => {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getState = () => state;

const NO_REACTIONS: ReadonlySet<ProjectReactionType> = new Set();

let loadPromise: Promise<void> | null = null;

/**
 * Loads the logged-in user's reactions once. Safe to call from every card;
 * only the first call makes a request. Only call this when logged in.
 */
export const loadMyReactions = (): Promise<void> => {
  loadPromise ??= (async () => {
    const response = await getMyProjectReactions();
    if (!response.data) {
      //let a later call try again (e.g. the session wasn't ready yet)
      loadPromise = null;
      return;
    }

    const mine = new Map<number, Set<ProjectReactionType>>();
    for (const { projectId, reaction } of response.data) {
      const reactions = mine.get(projectId) ?? new Set<ProjectReactionType>();
      reactions.add(reaction);
      mine.set(projectId, reactions);
    }
    setState({ mine, loaded: true });
  })();

  return loadPromise;
};

//the counts after one more (delta 1) or one fewer (delta -1) user used a reaction
const adjustCounts = (
  counts: readonly ProjectReactionCount[],
  reaction: ProjectReactionType,
  delta: 1 | -1,
): ProjectReactionCount[] => {
  const byReaction = new Map(counts.map((entry) => [entry.reaction, entry.count]));
  const next = Math.max(0, (byReaction.get(reaction) ?? 0) + delta);
  if (next === 0) byReaction.delete(reaction);
  else byReaction.set(reaction, next);

  return PROJECT_REACTIONS.filter((option) => byReaction.has(option.reaction)).map((option) => ({
    reaction: option.reaction,
    count: byReaction.get(option.reaction) as number,
  }));
};

//a copy of mine with one reaction on a project turned on or off
const withMine = (projectId: number, reaction: ProjectReactionType, on: boolean) => {
  const mine = new Map(state.mine);
  const reactions = new Set(mine.get(projectId));
  if (on) reactions.add(reaction);
  else reactions.delete(reaction);
  mine.set(projectId, reactions);
  return mine;
};

const pending = new Set<string>();

/**
 * Adds the user's reaction to a project, or removes it if they already used
 * it. The change shows immediately and is rolled back if the server rejects it.
 *
 * @param projectId - The project being reacted to
 * @param reaction - The reaction to toggle
 * @param loadedCounts - The counts the project was loaded with, used until the
 *   user changes them
 */
export const toggleReaction = async (
  projectId: number,
  reaction: ProjectReactionType,
  loadedCounts: readonly ProjectReactionCount[],
): Promise<void> => {
  //ignore a second press while the first is still being saved
  const key = `${projectId}:${reaction}`;
  if (pending.has(key)) return;
  pending.add(key);

  try {
    await loadMyReactions();

    const had = state.mine.get(projectId)?.has(reaction) ?? false;
    const currentCounts = state.counts.get(projectId) ?? loadedCounts;

    //show the change right away
    setState({
      mine: withMine(projectId, reaction, !had),
      counts: new Map(state.counts).set(
        projectId,
        adjustCounts(currentCounts, reaction, had ? -1 : 1),
      ),
    });

    const response = had
      ? await deleteProjectReaction(projectId, reaction)
      : await addProjectReaction(projectId, reaction);

    if (!response.error) return;

    //Rejected: undo the count change. If the server says our idea of "mine"
    //was out of date (already added / never added), trust the server on that.
    const wasOutOfDate = (!had && response.status === 409) || (had && response.status === 404);
    setState({
      mine: withMine(projectId, reaction, wasOutOfDate ? !had : had),
      counts: new Map(state.counts).set(
        projectId,
        adjustCounts(state.counts.get(projectId) ?? currentCounts, reaction, had ? 1 : -1),
      ),
    });
  } finally {
    pending.delete(key);
  }
};

/**
 * The reactions to show for a project and which of them are the user's.
 *
 * @param projectId - The project to show
 * @param loadedCounts - The counts the project was loaded with
 */
export const useProjectReactions = (
  projectId: number,
  loadedCounts: readonly ProjectReactionCount[],
) => {
  const current = useSyncExternalStore(subscribe, getState);

  return {
    counts: current.counts.get(projectId) ?? loadedCounts,
    mine: current.mine.get(projectId) ?? NO_REACTIONS,
  };
};
