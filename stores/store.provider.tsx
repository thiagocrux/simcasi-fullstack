'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { hydrateStore } from './auth/auth.slice';
import { makeStore } from './index';

/**
 * Provider component to wrap the application with the Redux store.
 * Handles lazy store initialization and hydration from persistent storage.
 * @param props.children React nodes to be wrapped by the provider.
 * @returns The Redux Provider component.
 */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lazy initialization: React ensures makeStore() is called only once.
  const [store] = useState(function initStore() {
    return makeStore();
  });

  useEffect(
    function performHydration() {
      // Hydrate the store from localStorage on mount.
      store.dispatch(hydrateStore());
    },
    [store]
  );

  return <Provider store={store}>{children}</Provider>;
}
