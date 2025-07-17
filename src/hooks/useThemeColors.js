import { useState, useEffect } from 'react';

const getRGBColor = (colorVariable) => {
  const color = getComputedStyle(document.documentElement).getPropertyValue(colorVariable).trim();
  return `rgb(${color})`;
};

export const useThemeColors = () => {
  const [themeColors, setThemeColors] = useState({
    primary: getRGBColor('--color-primary'),
    accent: getRGBColor('--color-accent'),
    textSecondary: getRGBColor('--color-text-secondary'),
    border: getRGBColor('--color-border'),
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setThemeColors({
        primary: getRGBColor('--color-primary'),
        accent: getRGBColor('--color-accent'),
        textSecondary: getRGBColor('--color-text-secondary'),
        border: getRGBColor('--color-border'),
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return themeColors;
};
