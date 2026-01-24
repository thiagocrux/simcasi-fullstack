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

/**
 * Redux slice for managing authentication state.
 */
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Sets the user credentials and permissions.
     */
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; permissions: string[] }>
    ) => {
      state.user = action.payload.user;
      state.permissions = action.payload.permissions;
      state.isAuthenticated = true;
      state.isHydrated = true;

      // Persist the authentication state to local storage.
      if (typeof window !== 'undefined') {
        localStorage.setItem('simcasi_auth', JSON.stringify(action.payload));
      }
    },
    /**
     * Clears the user credentials and logs them out.
     */
    logout: (state) => {
      state.user = null;
      state.permissions = [];
      state.isAuthenticated = false;
      state.isHydrated = true;

      // Remove the authentication state from local storage.
      if (typeof window !== 'undefined') {
        localStorage.removeItem('simcasi_auth');
      }
    },
    /**
     * Hydrates the store from local storage.
     */
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
            // Log an error if hydration fails.
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
