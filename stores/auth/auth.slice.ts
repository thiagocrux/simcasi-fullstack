import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
}

interface AuthState {
  user: User | null;
  permissions: string[];
  isAuthenticated: boolean;
  isHydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  permissions: [],
  isAuthenticated: false,
  isHydrated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; permissions: string[] }>
    ) => {
      state.user = action.payload.user;
      state.permissions = action.payload.permissions;
      state.isAuthenticated = true;
      state.isHydrated = true;

      // Persist to localStorage.
      if (typeof window !== 'undefined') {
        localStorage.setItem('simcasi_auth', JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null;
      state.permissions = [];
      state.isAuthenticated = false;
      state.isHydrated = true;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('simcasi_auth');
      }
    },
    hydrateStore: (state) => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('simcasi_auth');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            state.user = parsed.user;
            state.permissions = parsed.permissions;
            state.isAuthenticated = true;
          } catch (error) {
            console.error('Failed to hydrate auth store.', error);
          }
        }
      }
      state.isHydrated = true;
    },
  },
});

export const { setCredentials, logout, hydrateStore } = authSlice.actions;
export const authReducer = authSlice.reducer;
