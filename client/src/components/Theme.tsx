const updateThemeIcons = (theme: string) => {
    document.querySelectorAll('.theme-icon').forEach((img) => {
      const src = theme === 'light' ? img.getAttribute('src-light') : img.getAttribute('src-dark');
      if (src) img.setAttribute('src', src);
    });
};
