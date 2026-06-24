import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/services/api";
import { API_BASE_URL } from "@/utils/constants";

type Role = "farmer" | "buyer" | null;
type Page =
  | "landing" | "login"
  | "farmer-dashboard" | "buyer-dashboard"
  | "iot-monitor" | "weather" | "ai-market"
  | "product-listing" | "product-management" | "orders";

interface User {
  id: number;
  full_name: string;
  email: string;
  role: "farmer" | "buyer";
  county: string;
}

interface AuthContextValue {
  role: Role;
  setRole: (r: Role) => void;
  page: Page;
  setPage: (p: Page) => void;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  role: "farmer" | "buyer";
  county: string;
}

const TOKEN_KEY = "agrinexus_token";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole]     = useState<Role>(null);
  const [page, setPage]     = useState<Page>("landing");
  const [user, setUser]     = useState<User | null>(null);
  const [token, setToken]   = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  // On app load, restore user from token
  useEffect(() => {
    if (token) {
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.success && res.data) {
          setUser(res.data);
          setRole(res.data.role as "farmer" | "buyer");
          setPage(res.data.role === 'farmer' ? 'farmer-dashboard' : 'buyer-dashboard');
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setRole(null);
          setPage('landing');
        }
      })
        .catch(() => {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success) {
        localStorage.setItem(TOKEN_KEY, res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setRole(res.data.user.role);
        setPage(res.data.user.role === 'farmer' ? 'farmer-dashboard' : 'buyer-dashboard');
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const res = await api.post('/auth/register', data);
      if (res.success) {
        localStorage.setItem(TOKEN_KEY, res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setRole(res.data.user.role);
        setPage(res.data.user.role === 'farmer' ? 'farmer-dashboard' : 'buyer-dashboard');
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (e: any) {
      return { success: false, message: e.message };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setRole(null);
    setPage('landing');
  };

  return (
    <AuthContext.Provider value={{
      role, setRole, page, setPage,
      user, token, login, register, logout, loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}