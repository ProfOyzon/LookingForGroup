import { createContext } from 'react';
import { ThemeContextProps } from '../interfaces/ThemeContextProps';

export const ThemeContext = createContext<ThemeContextProps>({
    theme: 'dark',
    setTheme: () => { },
});