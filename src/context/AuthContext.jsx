import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { getSession, onAuthStateChange, signIn, signUp, signOut } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session on mount and subscribe to auth changes
  useEffect(() => {
    let mounted = true;

    getSession().then((s) => {
      if (mounted) {
        setSession(s);
        setUser(s?.user || null);
        setLoading(false);
      }
    });

    const { data: { subscription } } = onAuthStateChange((_event, s) => {
      if (mounted) {
        setSession(s);
        setUser(s?.user || null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await signIn(email, password);
    return data;
  }, []);

  const register = useCallback(async (email, password, metadata) => {
    const data = await signUp(email, password, metadata);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setSession(null);
    setUser(null);
  }, []);

  const value = {
    session,
    user,
    loading,
    isAuthenticated: !!session,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
