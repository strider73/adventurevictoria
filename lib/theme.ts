export const theme = {
  colors: {
    primary: {
      brand: "#5e6ad2",
      brandHover: "#828fff",
      brandTint: "#18182f",
      brandText: "#ffffff",
    },
    background: {
      primary: "#08090a",
      secondary: "#1c1c1f",
      tertiary: "#232326",
    },
    text: {
      primary: "#f7f8f8",
      secondary: "#d0d6e0",
      tertiary: "#8a8f98",
    },
    border: {
      primary: "#23252a",
      secondary: "#34343a",
    },
    accent: {
      accent: "#7170ff",
      accentHover: "#828fff",
    },
    semantic: {
      red: "#eb5757",
      orange: "#fc7840",
      yellow: "#f2c94c",
      green: "#4cb782",
      blue: "#4ea7fc",
    },
  },
  borders: {
    radius: {
      sm: "4px",
      md: "6px",
      lg: "8px",
      xl: "10px",
      full: "9999px",
    },
  },
  shadows: {
    low: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    medium: "0px 4px 24px rgba(0, 0, 0, 0.2)",
    high: "0px 7px 32px rgba(0, 0, 0, 0.35)",
  },
} as const;

export type Theme = typeof theme;
