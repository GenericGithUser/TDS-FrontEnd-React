import { useContext, createContext, useState, useEffect } from "react";
// import DUMMY_USR from "../assets/dummyUserData";
import api from '../api/client'

const AuthContext = createContext(null);


export const AuthProvider = ( { children } ) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      const isValidUser =
        storedUser && storedUser !== "undefined" && storedUser !== "null";
      const isValidToken =
        storedToken && storedToken !== "undefined" && storedToken !== "null";

      if (!isValidUser || !isValidToken) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setLoading(false);
        return;
      }

      const verifyToken = async () => {
        try {
          // Uses axios client - token auto-attached by request interceptor
          await api.get("/auth/verify");
          setUser(JSON.parse(storedUser));
        } catch {
          // 401 interceptor in client.js already handles clearing storage + redirect
        } finally {
          setLoading(false);
        }
      };

      verifyToken();
    }, []);

    const login = async (id, password) =>{
        try {
            const result = await api.post("/auth/login", { id, password });
 
            if (result.success) {
                setUser(result.user);
                localStorage.setItem("user", JSON.stringify(result.user));
                localStorage.setItem("token", result.token);

                console.log("login result from backend:", result);
                console.log(
                  "must_change_password value:",
                  result.user?.must_change_password,
                );
                if (
                  result.user.must_change_password === true ||
                  result.user.must_change_password === "true"
                ) {
                  return { success: true, mustChangePassword: true };
                }
                return { success: true };
            } else {
                return { success: false, error: result.message };
            }
        } catch (err) {
          const isNetworkError = !err.message || err instanceof TypeError;

          return {
              success: false,
              error: isNetworkError
                  ? "Cannot connect to server."
                  : err.message   // ← "In
            } 
          }
    };

    const logout = () =>{
          setUser(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
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