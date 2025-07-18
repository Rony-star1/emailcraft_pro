import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-50 transition-micro focus:outline-none focus:bg-secondary-50"
      role="menuitem"
    >
      <Icon name={isDarkMode ? 'Sun' : 'Moon'} size={16} className="mr-3" />
      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default ThemeToggle;
