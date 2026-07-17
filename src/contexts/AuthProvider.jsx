import { useState, useCallback, useEffect, useRef } from "react";
import AuthContext from "./AuthContext";
import api from "../utils/api";
import LoadingScreen from "../components/loading/LoadingScreen";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const start = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(90, (elapsed / 2000) * 90);
      setProgress(p);
    }, 50);

    Promise.all([
      api.get("/auth/me").then((res) => res.data).catch(() => null),
      new Promise((r) => setTimeout(r, 2000)),
    ])
      .then(([data]) => {
        if (data) {
          setUser({ id: data.id, name: data.name });
          setToken(data.token);
        }
        setProgress(100);
        clearInterval(intervalRef.current);
      })
      .finally(() => {
        setTimeout(() => setLoading(false), 300);
      });

    return () => clearInterval(intervalRef.current);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setUser({ id: res.data.id, name: res.data.name });
    setToken(res.data.token);
  }, []);

  const register = useCallback(async (name, email, password, passwordConfirmation) => {
    const res = await api.post("/auth/register", { name, email, password, passwordConfirmation });
    setUser({ id: res.data.id, name: res.data.name });
    setToken(res.data.token);
  }, []);

  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    setUser(null);
    setToken(null);
  }, []);

  if (loading) return <LoadingScreen progress={progress} />;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
