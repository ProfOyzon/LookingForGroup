import { createContext } from 'react';
import ThemeContextProps from '../interfaces/ThemeContextProps';

const ThemeContext = createContext<ThemeContextProps>({
    theme: 'dark',
    setTheme: () => { },
});

export default ThemeContext;