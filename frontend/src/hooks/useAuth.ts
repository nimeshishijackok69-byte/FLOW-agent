import { useState, useEffect, useCallback } from 'react';
import { User, getStoredUser, verifyToken, logout as doLogout, getSessionExpiry } from '../lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [loading, setLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(getSessionExpiry());

  useEffect(() => {
    verifyToken().then(u => {
      setUser(u);
      setSessionExpiry(getSessionExpiry());
      setLoading(false);
      console.log('useAuth useEffect - user after verifyToken:', u); // Debug log
    }).catch((e) => {
      console.error('useAuth useEffect - verifyToken failed:', e); // Debug log
      setLoading(false);
    });
  }, []);

  const logout = useCallback(() => { doLogout(); setUser(null); }, []);
  const refreshUser = useCallback((newUser?: User) => {
    const refreshedUser = newUser || getStoredUser();
    setUser(refreshedUser);
    setSessionExpiry(getSessionExpiry());
    console.log('refreshUser called, user set to:', refreshedUser); // Debug log
  }, []);

  return { user, loading, logout, refreshUser, sessionExpiry };
}
