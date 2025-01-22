import { useContext } from 'react';
import { ThemeIconProps } from '../interfaces/ThemeIconProps';
import { ThemeContext } from '../contexts/ThemeContext';

export const ThemeIcon: React.FC<ThemeIconProps> = ({
  light,
  dark,
  alt = '',
  id = '',
  addClass = '',
}) => {
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
};
