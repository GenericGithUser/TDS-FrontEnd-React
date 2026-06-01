import { createContext, useContext, useState, useCallback } from "react";

const NavigationDataContext = createContext(null);
const STORAGE_KEY = "nav_context_data";
const TTL_MS = 10 * 60 * 1000; // 10 minutes

export function NavigationDataProvider( { children} ){
  const [navData, setNavData] = useState(() => {
    // 🔄 Restore on mount
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const { data, timestamp } = JSON.parse(stored);
      if (Date.now() - timestamp > TTL_MS) {
        sessionStorage.removeItem(STORAGE_KEY); // Expired
        return null;
      }
      return data;
    } catch {
      return null;
    }
  });

  const setRouteData = useCallback((data) => {
    const payload = {
        data: data,
        timestamp: Date.now(),
    };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  setNavData(data); // Keep in-memory for immediate use
  }, []);

  

  const clearRouteData = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setNavData(null);
  }, []);

  return (
    <NavigationDataContext.Provider
      value={{ navData, setRouteData, clearRouteData }}
    >
      {children}
    </NavigationDataContext.Provider>
  );
}


export function useNavigationData(){
    const context = useContext(NavigationDataContext);

    if (!context){
        throw new Error('useNavigationData must be used within NavigationDataProvide');


    }
    return context;
}


