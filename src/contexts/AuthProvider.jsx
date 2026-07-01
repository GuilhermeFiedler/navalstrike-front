import { useState, useCallback } from "react";
import AuthContext from "./AuthContext";
import { jwtDecode } from "jwt-decode";

export default function AuthProvider({children})
{
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const[loading, setLoading] = useState(false);
    const user = token ? jwtDecode(token) : null;

    const login = useCallback(async (email, password) => {
        setLoading(true);
        try {
            const res = await api.post("/auth/login", {email, password});
            console.log("LOGIN RESPONSE:", res.data);
            const token = res.data.token;

            localStorage.setItem("token", token);
            setToken(token);
        } finally {
            setLoading(false);
        }
    }, []);

   const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
   },[]);
   
   return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}