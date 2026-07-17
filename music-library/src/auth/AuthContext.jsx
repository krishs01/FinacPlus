import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authenticateUser, decodeMockToken } from './jwt';

const AuthContext = createContext(null);

const TOKEN_KEY = 'music_library_token';

/**
 * AuthProvider — manages authentication state (login, logout, token persistence).
 *
 * The token is stored in localStorage so the user stays logged in across refreshes.
 * On mount, we check for an existing token and validate it (check expiry).
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      const payload = decodeMockToken(storedToken);
      if (payload) {
        setUser({ username: payload.sub, name: payload.name, role: payload.role });
        setToken(storedToken);
      } else {
        // Token expired or invalid — clear it
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((username, password) => {
    const result = authenticateUser(username, password);
    setUser(result.user);
    setToken(result.token);
    localStorage.setItem(TOKEN_KEY, result.token);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
  }, []);

  // Convenience helpers for role checks
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access auth state and actions.
 * Must be used within an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
