import { memo, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

type ThemeIconProps = {
  light: string;
  dark: string;
  alt?: string;
  id?: string;
  addClass?: string;
};

export const ThemeIcon: React.FC<ThemeIconProps> = memo(
  ({ light, dark, alt = '', id = '', addClass = '' }) => {
    const theme = useContext(ThemeContext)['theme'];

    return (
      <img
        src={theme === 'dark' ? dark : light}
        src-light={light}
        src-dark={dark}
        alt={alt}
        id={id}
        className={`theme-icon ${addClass}`}
      />
    );
  }
);
