import { create } from 'zustand';

interface AuthState {
  token: string | null;
  role: string | null;
  email: string | null;
  fullName: string | null;
  isAuthenticated: boolean;
  login: (token: string, role: string, email: string, fullName: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Inicialización de la sesión desde localStorage
  const savedToken = localStorage.getItem('allinvida_token');
  const savedRole = localStorage.getItem('allinvida_role');
  const savedEmail = localStorage.getItem('allinvida_email');
  const savedFullName = localStorage.getItem('allinvida_fullname');

  return {
    token: savedToken,
    role: savedRole,
    email: savedEmail,
    fullName: savedFullName,
    isAuthenticated: !!savedToken,
    login: (token, role, email, fullName) => {
      localStorage.setItem('allinvida_token', token);
      localStorage.setItem('allinvida_role', role);
      localStorage.setItem('allinvida_email', email);
      localStorage.setItem('allinvida_fullname', fullName);
      set({ token, role, email, fullName, isAuthenticated: true });
    },
    logout: () => {
      localStorage.removeItem('allinvida_token');
      localStorage.removeItem('allinvida_role');
      localStorage.removeItem('allinvida_email');
      localStorage.removeItem('allinvida_fullname');
      set({ token: null, role: null, email: null, fullName: null, isAuthenticated: false });
    }
  };
});
