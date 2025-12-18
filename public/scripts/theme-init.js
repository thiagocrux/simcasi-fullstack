/**
 * theme-init.js
 * -------------------------
 * Apply the user's theme preference as early as possible (before React
 * hydrates) to avoid flashes and hydration mismatches. This file is
 * intentionally minimal, runs in the browser before hydration, and must
 * not rely on any bundler or module system (hence plain IIFE).
 *
 * Notes:
 *  - Looks for a `theme` cookie (e.g. `theme=dark`) first, then localStorage,
 *    and finally falls back to the system preference.
 *  - Keeps payloads and side-effects minimal. Any errors are reported in
 *    development via console and in production via a small beacon/fetch
 *    request to `/api/log` (fire-and-forget).
 */

(() => {
  try {
    // Read `theme` cookie (if present)
    const cookieMatch = document.cookie.match(/(^|;)\s*theme=\s*([^;]+)/);
    const cookieTheme = cookieMatch ? cookieMatch.pop() : null;

    // Read from localStorage (guarded since some environments may restrict it)
    const localStorageTheme = (() => {
      try {
        return localStorage.getItem('theme');
      } catch (error) {
        return null;
      }
    })();

    // Determine system preference at runtime
    const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';

    // Resolve preference: cookie > localStorage > system
    const theme = cookieTheme || localStorageTheme || 'system';
    const appliedTheme = theme === 'system' ? preferredTheme : theme;

    // Apply the computed theme immediately to prevent FOUC/hydration mismatch
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(appliedTheme);
    document.documentElement.style.colorScheme = appliedTheme;
  } catch (error) {
    // In development, surface the error to console for quick debugging
    if (location.hostname === 'localhost') {
      console.error('theme-init failed', error);
      return;
    }

    // In production, send a small, non-blocking report. Keep payloads tiny
    // and avoid including user-sensitive data. Use sendBeacon if available,
    // otherwise fallback to `fetch` with `keepalive`.
    try {
      const payload = JSON.stringify({
        event: 'theme-init-error',
        ts: Date.now(),
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/log', payload);
      } else {
        fetch('/api/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch (error) {
      // If logging fails, silently ignore to avoid affecting the user
    }
  }
})();
