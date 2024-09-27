function setTheme(themeName, setIdName) {
    localStorage.setItem('theme', themeName);
    setIdName(themeName);
}

function keepTheme(setIdName) {
    const theme = localStorage.getItem('theme');
    if (theme) {
        if (theme === 'theme-dark') {
            setTheme('theme-dark', setIdName);
        }

        if (theme === 'theme-light') {
            setTheme('theme-light', setIdName);
        }

        return;
    }

    const prefersDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkTheme.matches) {
        setTheme('theme-dark', setIdName);
        return;
    }

    const prefersLightTheme = window.matchMedia('(prefers-color-scheme: light)');
    if (prefersLightTheme.matches) {
        setTheme('theme-light', setIdName);
        return;
    }

    setTheme('theme-dark', setIdName);
}

export { setTheme, keepTheme };