import { useContext, createContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const DUMMY = [
  {
    id: "MEM-0001",
    email: "adr.pama@mayniladwater.com.ph",
    name: "Adrian P. Pama",
    password: "pama123",
    role: "preparer",
    branch: "Maynilad North Manila Business Center",
  },
  {
    id: "MEM-0014",
    email: "tl.tabuyan@mayniladwater.com.ph",
    name: "Tomas Lyndon S. Tabuyan",
    password: "tabuyan123",
    role: "approver",
    branch: "Maynilad North Manila Business Center",
  },
  {
    id: "MEM-0025",
    email: "adr.pama@mayniladwater.com.ph",
    name: "Gianmarlo Adrian S. Abril",
    password: "abril123",
    role: "receiver",
    branch: "Head Office",
  }
];

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
        const foundUser = DUMMY.find(
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