import { create } from "zustand";

interface AuthState {
  token: string | null;
  email: string | null;
  setSession: (token: string, email: string) => void;
  clearSession: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: null,
  email: null,
  setSession: (token, email) => set({ token, email }),
  clearSession: () => set({ token: null, email: null }),
}));
