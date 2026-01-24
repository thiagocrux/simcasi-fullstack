'use client';

import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { makeStore } from './index';
import { hydrateStore } from './auth/auth.slice';

/**
 * Provider component to wrap the application with the Redux store.
 */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lazy initialization: React ensures makeStore() is called only once.
  const [store] = useState(() => makeStore());

  useEffect(() => {
    // Hydrate the store from localStorage on mount.
    store.dispatch(hydrateStore());
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
