import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ProjectReactionCount, ProjectReactionType } from '@looking-for-group/shared';
import { PROJECT_REACTIONS, PROJECT_REACTION_BY_KEY } from '../constants/projectReactions';
import { loadMyReactions, toggleReaction, useProjectReactions } from '../functions/projectReactions';

// Space kept between the reaction tray and the edge of the card
const EDGE_MARGIN = 8;

interface ReactionProps {
  projectId: number;
  /** The counts the project was loaded with */
  loadedCounts: ProjectReactionCount[];
  loggedIn: boolean;
  /** Called instead of reacting when the user isn't logged in */
  onRequireLogin: () => void;
}

/**
 * Shared by the add button and the chips: which reactions the project has and
 * which are the user's, plus a function that adds or removes one of the user's.
 * Pressing while logged out calls onRequireLogin instead.
 */
const useReact = ({ projectId, loadedCounts, loggedIn, onRequireLogin }: ReactionProps) => {
  const { counts, mine } = useProjectReactions(projectId, loadedCounts);

  // Which reactions are the user's is loaded once and shared by every card
  useEffect(() => {
    if (loggedIn) void loadMyReactions();
  }, [loggedIn]);

  const react = (reaction: ProjectReactionType) => {
    if (!loggedIn) {
      onRequireLogin();
      return;
    }
    void toggleReaction(projectId, reaction, loadedCounts);
  };

  return { counts, mine, react };
};

/**
 * A chip with a count for every reaction that has been used on a project,
 * most-used first, highlighted when it's the user's own. The row never wraps
 * or overflows: if it's too narrow for every chip, only the top ones that fit
 * are shown. Pressing a chip adds the user's reaction, or removes it if they
 * already used it. Renders nothing until the project has a reaction. It sits
 * above the card's full-card link overlay (see reactions.css), so pressing it
 * never opens the project.
 *
 * @param projectId - The project the reactions belong to
 * @param loadedCounts - Counts loaded with the project, shown until the user changes them
 * @param loggedIn - Whether there's a logged-in user; if not, pressing sends them to log in
 * @param onRequireLogin - Called when a logged-out user tries to react
 */
export const ReactionChips = (props: ReactionProps) => {
  const { counts, mine, react } = useReact(props);
  const rowRef = useRef<HTMLDivElement>(null);

  // Most-used first (ties keep the order PROJECT_REACTIONS lists them in), so
  // when the row is too narrow for all of them the ones that stay are the top ones
  const ranked = [...counts].sort(
    (a, b) =>
      b.count - a.count ||
      PROJECT_REACTIONS.findIndex((option) => option.reaction === a.reaction) -
        PROJECT_REACTIONS.findIndex((option) => option.reaction === b.reaction),
  );
  const rankKey = ranked.map(({ reaction, count }) => `${reaction}:${count.toString()}`).join(',');

  // Show only as many chips as fit on one line: show them all, then hide from
  // the first one that runs past the end of the row onward. Done on the DOM
  // before paint (and again whenever the row is resized) so nothing flashes or
  // overflows.
  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const hideOverflow = () => {
      const chips = Array.from(row.children) as HTMLElement[];
      chips.forEach((chip) => {
        chip.hidden = false;
      });

      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      let used = 0;
      let full = false;
      chips.forEach((chip, index) => {
        const next = used + (index === 0 ? 0 : gap) + chip.offsetWidth;
        // the top reaction always stays, even in a very narrow row
        if (full || (index > 0 && next > row.clientWidth)) {
          full = true;
          chip.hidden = true;
        } else {
          used = next;
        }
      });
    };

    hideOverflow();

    // Run again when the row is resized, or when a chip changes width (e.g. the
    // emoji font finishing loading after the first measurement)
    const observer = new ResizeObserver(hideOverflow);
    observer.observe(row);
    Array.from(row.children).forEach((chip) => {
      observer.observe(chip);
    });
    void document.fonts.ready.then(hideOverflow);

    return () => {
      observer.disconnect();
    };
  }, [rankKey]);

  if (ranked.length === 0) return null;

  return (
    <div className='reaction-chips' ref={rowRef}>
      {ranked.map(({ reaction, count }) => {
        const option = PROJECT_REACTION_BY_KEY[reaction];
        const isMine = mine.has(reaction);
        return (
          <button
            key={reaction}
            type='button'
            className={isMine ? 'reaction-chip mine' : 'reaction-chip'}
            aria-pressed={isMine}
            aria-label={`${option.label}, ${count.toString()}`}
            title={option.label}
            onClick={() => {
              react(reaction);
            }}
          >
            <span className='reaction-emoji' aria-hidden='true'>
              {option.emoji}
            </span>
            <span className='reaction-count'>{count}</span>
          </button>
        );
      })}
    </div>
  );
};

/**
 * The gray smiley button that opens a small tray of the available reactions
 * to pick from. Picking one adds the user's reaction, or removes it if they
 * already used it. The tray is lined up with the button, then slid back inside
 * the card (or the project page's info panel) if it would run past an edge.
 * Closes on a press outside, or Escape.
 *
 * @param projectId - The project the reactions belong to
 * @param loadedCounts - Counts loaded with the project, shown until the user changes them
 * @param loggedIn - Whether there's a logged-in user; if not, pressing sends them to log in
 * @param onRequireLogin - Called when a logged-out user tries to react
 */
export const ReactionAddButton = (props: ReactionProps) => {
  const { mine, react } = useReact(props);
  const [open, setOpen] = useState(false);
  const [trayX, setTrayX] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);

  // Close the tray on a press outside it, or Escape
  useEffect(() => {
    if (!open) return;

    const closeOnOutsidePress = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  // Line the tray up with the button's right edge, then keep it inside the card
  useLayoutEffect(() => {
    const root = rootRef.current;
    const tray = trayRef.current;
    const bounds = root?.closest('.project-panel, #project-info-panel');
    if (!open || !root || !tray || !bounds) return;

    const rootRect = root.getBoundingClientRect();
    const boundsRect = bounds.getBoundingClientRect();
    const trayWidth = tray.getBoundingClientRect().width;

    const minLeft = boundsRect.left + EDGE_MARGIN;
    const maxLeft = boundsRect.right - EDGE_MARGIN - trayWidth;
    const left = Math.min(Math.max(rootRect.right - trayWidth, minLeft), Math.max(maxLeft, minLeft));
    setTrayX(left - rootRect.left);
  }, [open]);

  const toggleTray = () => {
    if (!props.loggedIn) {
      props.onRequireLogin();
      return;
    }
    setOpen((wasOpen) => !wasOpen);
  };

  return (
    <div className='reaction-add-wrap' ref={rootRef}>
      <button
        type='button'
        className='reaction-add'
        aria-label='Add reaction'
        aria-expanded={open}
        title='Add reaction'
        onClick={toggleTray}
      >
        <svg
          width='32'
          height='32'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
          aria-hidden='true'
        >
          <circle cx='11' cy='13' r='8' />
          <path d='M7.8 15.6c1.7 2 4.7 2 6.4 0' />
          <path d='M8.6 11.2h.01M13.4 11.2h.01' strokeWidth='2.4' />
          <path d='M19 2.5v5M16.5 5h5' />
        </svg>
      </button>

      {open && (
        <div
          className='reaction-tray'
          role='group'
          aria-label='Pick a reaction'
          ref={trayRef}
          style={{ left: trayX }}
        >
          {PROJECT_REACTIONS.map(({ reaction, emoji, label }) => {
            const isMine = mine.has(reaction);
            return (
              <button
                key={reaction}
                type='button'
                className={isMine ? 'reaction-pick mine' : 'reaction-pick'}
                aria-pressed={isMine}
                aria-label={label}
                title={label}
                onClick={() => {
                  react(reaction);
                  setOpen(false);
                }}
              >
                {emoji}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
