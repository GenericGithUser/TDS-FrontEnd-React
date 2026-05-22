import { createContext, useContext, useState, useCallback } from "react";

const NavigationDataContext = createContext(null);

export function NavigationDataProvider( { children} ){
    const [navData, setNavData] = useState(null);

    const setRouteData = useCallback((data)=> setNavData(data), []);
    const clearRouteData = useCallback(()=> setNavData(null), []);

    return(
        <NavigationDataContext.Provider value={{ navData, setRouteData, clearRouteData }}>
            { children }
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


