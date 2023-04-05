import { createContext, useContext } from "react";

export interface SettingsDrawerContextData {
  toggleSettingsDrawer: () => void;
  settingsDrawerVisible: boolean;
}

export const SettingsDrawerContext =
  createContext<SettingsDrawerContextData | null>(null);

export const useSettingsDrawerContext = () => {
  const context = useContext(SettingsDrawerContext);
  if (!context) {
    throw new Error(
      "useSettingsDrawerContext must be used within a SettingsDrawerContext.Provider"
    );
  }
  return context;
};
