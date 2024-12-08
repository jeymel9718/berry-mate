import { createContext, ReactNode, useContext, useState } from "react";

const PreferenceContext = createContext<{
  fabVisible: boolean;
  showFab: () => void;
  hideFab: () => void;
}>({ fabVisible: false, showFab: () => {}, hideFab: () => {}});

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [fabVisible, setFabVisible] = useState<boolean>(true);

  const showFab = () => setFabVisible(true);
  const hideFab = () => setFabVisible(false);

  return (
    <PreferenceContext.Provider value={{ fabVisible, showFab, hideFab }}>
      {children}
    </PreferenceContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferenceContext);
}
