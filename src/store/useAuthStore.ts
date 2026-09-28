import { create } from 'zustand';

export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'GUEST';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  setRoleQuick: (role: UserRole) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // Load initial from localStorage if available
  const savedToken = typeof window !== 'undefined' ? localStorage.getItem('sms_token') : null;
  const savedUser = typeof window !== 'undefined' ? localStorage.getItem('sms_user') : null;

  let initialUser: AuthUser | null = null;
  if (savedUser) {
    try {
      initialUser = JSON.parse(savedUser);
    } catch {
      initialUser = null;
    }
  }

  return {
    user: initialUser,
    token: savedToken,
    isAuthenticated: !!savedToken && !!initialUser,

    login: (token: string, user: AuthUser) => {
      localStorage.setItem('sms_token', token);
      localStorage.setItem('sms_user', JSON.stringify(user));
      set({ token, user, isAuthenticated: true });
    },

    logout: () => {
      localStorage.removeItem('sms_token');
      localStorage.removeItem('sms_user');
      set({ token: null, user: null, isAuthenticated: false });
    },

    // Quick switcher for demo and evaluation
    setRoleQuick: async (role: UserRole) => {
      if (role === 'GUEST') {
        localStorage.removeItem('sms_token');
        localStorage.removeItem('sms_user');
        set({ token: null, user: null, isAuthenticated: false });
        return;
      }

      let username = 'admin';
      let password = 'admin123';
      if (role === 'TEACHER') {
        username = 'teacher.rahman';
        password = 'teacher123';
      } else if (role === 'STUDENT') {
        username = 'stu.tanvir';
        password = 'student123';
      }

      try {
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (res.ok && data.token) {
          localStorage.setItem('sms_token', data.token);
          localStorage.setItem('sms_user', JSON.stringify(data.user));
          set({ token: data.token, user: data.user, isAuthenticated: true });
        }
      } catch (err) {
        console.error('Quick login failed:', err);
      }
    },
  };
});
