import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const toggleContrast = () => setHighContrast(hc => !hc);
  const toggleLargeText = () => setLargeText(lt => !lt);

  return (
    <ThemeContext.Provider value={{ theme, highContrast, largeText, toggleTheme, toggleContrast, toggleLargeText }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
