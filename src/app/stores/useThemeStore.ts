import { create } from "zustand";

interface ThemeState {
  primaryColor: string;
  secondaryColor: string;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  primaryColor: "#fffff",
  secondaryColor: "#808080",

  setPrimaryColor: (color) => {
    set({ primaryColor: color });
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--primary-color", color);
    }
  },

  setSecondaryColor: (color) => {
    set({ secondaryColor: color });
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--secondary-color", color);
    }
  },
}));
