import { useContext, createContext, useState, useEffect } from "react";
import DUMMY_USR from "../assets/dummyUserData";

const AuthContext = createContext(null);



export const AuthProvider = ( { children } ) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(()=>{
        const storedUser = localStorage.getItem('user');
        if (storedUser){
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (id, password) =>{
        const foundUser = DUMMY_USR.find(
            u => u.id === id && u.password === password
        );

        if (foundUser){
            const {password, ...userData} = foundUser;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return { success: true };

        }
        else{
            return {success: false, error: "Invalid Credentials"};
        }
    };

    const logout = () =>{
        setUser(null);
        localStorage.removeItem('user');
    };

    return(
        <AuthContext.Provider value={ { user, login, logout, loading } }>
            {children}
        </AuthContext.Provider>
    )


}

export const useAuth = () =>{
    const context = useContext(AuthContext);

    if(!context){
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context;
};