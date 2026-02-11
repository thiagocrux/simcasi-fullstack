import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { logger } from '@/lib/logger.utils';

/**
 * Represents the authenticated user identity.
 */
interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
}

/**
 * State structure for authentication and authorization.
 */
interface AuthState {
  /** The currently authenticated user or null. */
  user: User | null;
  /** List of permission codes granted to the user. */
  permissions: string[];
  /** Flag indicating if the user has an active session. */
  isAuthenticated: boolean;
  /** Flag indicating if the state has been synchronized with persistent storage. */
  isHydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  permissions: [],
  isAuthenticated: false,
  isHydrated: false,
};

/**
 * Redux slice for managing authentication, permissions, and hydration state.
 */
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Updates the store with user credentials and permissions.
     * Persists the data to localStorage for session continuity.
     * @param state The current auth state.
     * @param action The action payload containing user and permissions.
     */
    setCredentials(
      state,
      action: PayloadAction<{ user: User; permissions: string[] }>
    ): void {
      state.user = action.payload.user;
      state.permissions = action.payload.permissions;
      state.isAuthenticated = true;
      state.isHydrated = true;

      if (typeof window !== 'undefined') {
        localStorage.setItem('simcasi_auth', JSON.stringify(action.payload));
      }
    },

    /**
     * Resets the authentication state and removes data from persistent storage.
     * @param state The current auth state.
     */
    clearCredentials(state): void {
      state.user = null;
      state.permissions = [];
      state.isAuthenticated = false;
      state.isHydrated = true;

      if (typeof window !== 'undefined') {
        localStorage.removeItem('simcasi_auth');
      }
    },

    /**
     * Restores state from localStorage during application initialization.
     * @param state The current auth state.
     */
    hydrateStore(state): void {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('simcasi_auth');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            state.user = parsed.user;
            state.permissions = parsed.permissions;
            state.isAuthenticated = true;
          } catch (error) {
            logger.error('[AUTH_SLICE] Hydration failure:', error);
          }
        }
      }
      state.isHydrated = true;
    },

    /**
     * Updates specific permissions without changing the user profile.
     * @param state The current auth state.
     * @param action The action payload containing the new permission list.
     */
    updatePermissions(state, action: PayloadAction<string[]>): void {
      state.permissions = action.payload;

      if (typeof window !== 'undefined' && state.user) {
        const current = localStorage.getItem('simcasi_auth');
        if (current) {
          const parsed = JSON.parse(current);
          parsed.permissions = action.payload;
          localStorage.setItem('simcasi_auth', JSON.stringify(parsed));
        }
      }
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  hydrateStore,
  updatePermissions,
} = authSlice.actions;

/**
 * Alias for the auth slice reducer to be used in the store configuration.
 */
export const authReducer = authSlice.reducer;
