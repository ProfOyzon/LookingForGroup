import { memo, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

type ThemeIconProps = {
  light: string;
  dark: string;
  alt?: string;
  id?: string;
  addClass?: string;
  onClick?: React.MouseEventHandler<HTMLImageElement>;
};

export const ThemeIcon: React.FC<ThemeIconProps> = memo(
  ({ light, dark, alt = '', id = '', addClass = '', onClick }) => {
    const theme = useContext(ThemeContext)['theme'];

    return (
      <img
        src={theme === 'dark' ? dark : light}
        src-light={light}
        src-dark={dark}
        alt={alt}
        id={id}
        className={`theme-icon ${addClass}`}
        onClick={onClick}
      />
    );
  }
);
