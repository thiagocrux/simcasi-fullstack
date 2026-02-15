import type { AppDispatch, AppStore, RootState } from '@/stores';
import { useDispatch, useSelector, useStore } from 'react-redux';

/**
 * Custom hook to dispatch actions with typed support for the AppDispatch.
 * @return The typed useDispatch function.
 */
export function useAppDispatch(): AppDispatch {
  return useDispatch.withTypes<AppDispatch>()();
}

/**
 * Custom hook to select state from the typed RootState.
 * @return The typed useSelector function.
 */
export const useAppSelector = useSelector.withTypes<RootState>();

/**
 * Custom hook to access the typed AppStore.
 * @return The typed useStore function.
 */
export function useAppStore(): AppStore {
  return useStore.withTypes<AppStore>()();
}
