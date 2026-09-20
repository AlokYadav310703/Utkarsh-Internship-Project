import { useMemo, useState } from "react";
import { api, clearSession, setSession } from "../lib/api";
import { AuthContext } from "./auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("utkarsh_user");
    return stored ? JSON.parse(stored) : null;
  });

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    async login(payload) {
      const { data } = await api.post("/auth/login", payload);
      setSession(data.token, data.user);
      setUser(data.user);
      return data.user;
    },
    async register(payload) {
      const { data } = await api.post("/auth/register", payload);
      return data;
    },
    async verifyEmail(payload) {
      const { data } = await api.post("/auth/verify-email", payload);
      setSession(data.token, data.user);
      setUser(data.user);
      return data.user;
    },
    logout() {
      clearSession();
      setUser(null);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
