import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paths from '../constants/routes';
import { Tag } from './Tag';

interface TagDotProps {
  projectId: number;
  type: string;
  label: string;
}

// Space kept between the hover pill and the edge of the card
const EDGE_MARGIN = 8;
// Horizontal padding (10px x 2) and border (4px x 2) the pill adds around its label
const PILL_EXTRA_WIDTH = 28;
// Extra pixels so rounding never makes the label overflow its pill
const TEXT_SLACK = 2;

/**
 * A project tag shown as a small colored dot. Hovering it grows the dot into a
 * pill with the full label that floats over the dots around it (styles live in
 * discoverMeet.css under .tag-dot-wrap). The color comes from the Tag
 * component's type-to-color mapping, same as the regular tags.
 *
 * On hover the pill is sized to fit its label (up to the card's width) and
 * centered on the dot, then slid back inside the card if that would overflow
 * an edge. So a dot at the far left uses what room it has to its left first and
 * only then covers the dots to its right. CSS can't know where the dot sits in
 * the card, so the size and offset are measured here and passed down as the
 * --dot-w and --dot-x custom properties.
 *
 * Clicking it opens the project, matching the rest of the card/slide it sits
 * in. On cards this is also required: the dot sits above the card's link
 * overlay so it can receive hover, and would otherwise swallow the click.
 * Touch screens have no hover, so there the first tap expands the pill (the
 * tag-dot-open class) and a second tap opens the project; tapping anywhere
 * else closes it.
 *
 * @param projectId - The project the dot belongs to, used for navigation
 * @param type - Tag type, which determines the dot's color
 * @param label - The full tag name shown when hovering
 */
export const TagDot = ({ projectId, type, label }: TagDotProps) => {
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const fitPill = () => {
    const wrap = wrapRef.current;
    const bounds = wrap?.closest('.project-panel, .discover-project-about');
    const text = wrap?.querySelector('p');
    if (!wrap || !bounds || !text) return;

    const wrapRect = wrap.getBoundingClientRect();
    const boundsRect = bounds.getBoundingClientRect();
    const minLeft = boundsRect.left + EDGE_MARGIN;
    const maxRight = boundsRect.right - EDGE_MARGIN;

    // scrollWidth rounds down to a whole pixel, and a label even a fraction of
    // a pixel wider than the pill gets cut off by the ellipsis, so measure the
    // text exactly and round up
    const range = document.createRange();
    range.selectNodeContents(text);
    const textWidth = Math.ceil(range.getBoundingClientRect().width);

    const width = Math.max(
      wrapRect.width,
      Math.min(textWidth + PILL_EXTRA_WIDTH + TEXT_SLACK, maxRight - minLeft),
    );
    const centered = wrapRect.left + wrapRect.width / 2 - width / 2;
    const left = Math.min(Math.max(centered, minLeft), maxRight - width);

    wrap.style.setProperty('--dot-w', `${width}px`);
    wrap.style.setProperty('--dot-x', `${left - wrapRect.left}px`);
  };

  // While open, the pill stays expanded without a hover (touch screens)
  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePress = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsidePress);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePress);
  }, [open]);

  const handleClick = (e: React.MouseEvent) => {
    // Touch has no hover, so the first tap opens the pill and a second tap on
    // it opens the project. A mouse click always opens the project.
    const pointerType = (e.nativeEvent as PointerEvent).pointerType;
    const isTouch =
      pointerType === 'touch' || (!pointerType && window.matchMedia('(hover: none)').matches);
    if (isTouch && !open) {
      fitPill();
      setOpen(true);
      return;
    }
    navigate(`${paths.routes.PROJECT}?projectID=${projectId}`);
  };

  return (
    <div
      ref={wrapRef}
      className={open ? 'tag-dot-wrap tag-dot-open' : 'tag-dot-wrap'}
      onMouseEnter={fitPill}
      onClick={handleClick}
    >
      <Tag type={type} selected={true} className='tag-dot'>
        <p>{label}</p>
      </Tag>
    </div>
  );
};
