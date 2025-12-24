/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '../ui/button';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

/**
 * ThemeSwitcher component
 *
 * Purpose:
 * - Provide a small UI for the user to pick the application theme: `light`,
 *   `dark`, or `system` (follow operating system preference).
 * - Persist the selection in a cookie and in localStorage so the server can
 *   render the matching initial theme on subsequent requests and the client
 *   can re-apply the preference quickly.
 * - When `system` is selected, the component listens to `prefers-color-scheme`
 *   changes and updates the document root class (`light`/`dark`) automatically.
 *
 * Accessibility & Hydration:
 * - To avoid hydration mismatches (Radix/select or other interactive markup
 *   rendering differently between SSR and client), we render a small disabled
 *   placeholder button during server render and only mount the interactive
 *   `Select` after the component has mounted on the client. This eliminates
 *   complex ID generation and interactive differences on first paint.
 *
 * Implementation Notes:
 * - The component uses `next-themes`'s `useTheme()` hook to change theme and
 *   read the currently `resolvedTheme`.
 * - The `persistTheme` helper writes the cookie (`theme`) and `localStorage`.
 * - The matchMedia listener uses the modern `addEventListener('change', ...)`
 *   API with a guarded fallback to the deprecated `addListener` for older
 *   WebKit/Safari browsers.
 *
 * Example:
 * <ThemeSwitcher showLabel />
 */

type Theme = 'light' | 'dark' | 'system';

interface ThemeSwitcherProps {
  /** Render a textual label next to the control */
  showLabel?: boolean;
  /** Additional classes applied to the select trigger */
  selectClasses?: string;
  /** Additional classes applied to the select content */
  contentClasses?: string;
}

export function ThemeSwitcher({
  showLabel = false,
  selectClasses = '',
  contentClasses = '',
}: ThemeSwitcherProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  /*
   * Persist theme selection in two places:
   * - Cookie: so the server can read the preference and render the same
   *   theme on the next request (avoids hydration mismatch).
   * - localStorage: so client-only code can read it quickly without a round
   *   trip. Both writes are best-effort and wrapped in try/catch.
   */
  function persistTheme(theme: Theme) {
    try {
      // cookie expires in one year
      document.cookie = `theme=${theme}; path=/; max-age=${
        60 * 60 * 24 * 365
      }; SameSite=Lax`;

      localStorage.setItem('theme', theme);
    } catch (error: any) {
      // Failing to persist preference should not break the app
      console.log(error);
    }
  }

  /*
   * When the user selects `system`, the app should follow the OS preference
   * in real time. We use matchMedia to listen for changes to
   * `(prefers-color-scheme: dark)` and apply the appropriate class to the
   * document root. If the theme is explicitly `light` or `dark`, we just
   * ensure the DOM reflects that immediately.
   */
  useEffect(() => {
    if (theme !== 'system') {
      // Apply explicit theme immediately so the UI doesn't flash
      if (resolvedTheme) {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(resolvedTheme);
        document.documentElement.style.colorScheme = resolvedTheme;
      }

      return;
    }

    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    // Computes and applies the preferred theme based on the matchMedia
    // event or the current mediaQueryList state. The function accepts either
    // a MediaQueryListEvent (listener callback) or the MediaQueryList itself
    // when invoked synchronously during setup.
    function applyTheme(event?: MediaQueryListEvent | MediaQueryList) {
      let preferredTheme: 'light' | 'dark';

      if (event && 'matches' in event) {
        // Called from the change event handler
        preferredTheme = event.matches ? 'dark' : 'light';
      } else if (mediaQueryList.matches) {
        // Called synchronously during initialization
        preferredTheme = 'dark';
      } else {
        preferredTheme = 'light';
      }

      // Always keep the document root class and color-scheme in sync so
      // CSS `color-scheme`-aware components render correctly.
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(preferredTheme);
      document.documentElement.style.colorScheme = preferredTheme;
    }

    applyTheme();

    /*
     * Prefer the modern `addEventListener('change', ...)` API which is
     * supported in modern browsers. For legacy WebKit/Safari we still call
     * the deprecated `addListener` as a guarded fallback — this keeps the
     * component robust across a wider range of clients.
     */
    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', applyTheme as EventListener);
    } else if ((mediaQueryList as any).addListener) {
      // Deprecated but available in some older browsers
      (mediaQueryList as any).addListener(applyTheme);
    }

    return () => {
      if (typeof mediaQueryList.removeEventListener === 'function') {
        mediaQueryList.removeEventListener(
          'change',
          applyTheme as EventListener
        );
      } else if ((mediaQueryList as any).removeListener) {
        (mediaQueryList as any).removeListener(applyTheme);
      }
    };
  }, [theme, resolvedTheme]);

  const themeLabels: Record<Theme, any> = {
    light: {
      label: 'Tema claro',
      icon: <Sun />,
    },
    dark: {
      label: 'Tema escuro',
      icon: <Moon />,
    },
    system: {
      label: 'Tema do sistema',
      icon: <Monitor />,
    },
  };

  if (!mounted) {
    return (
      <Button
        variant="outline"
        className={`text-muted-foreground hover:text-muted-foreground bg-transparent transition-none ${selectClasses}`}
        disabled
      >
        <Sun className="opacity-50" />
        {showLabel && <span className="opacity-50">Carregando...</span>}
      </Button>
    );
  }

  if (!resolvedTheme) {
    return null;
  }

  return (
    <Select
      value={theme ?? 'system'}
      onValueChange={(newValue: Theme) => {
        setTheme(newValue);
        persistTheme(newValue);
      }}
    >
      <SelectTrigger className={selectClasses} size="sm">
        <SelectValue placeholder="Selecione um tema" />
      </SelectTrigger>
      <SelectContent className={contentClasses}>
        <SelectGroup>
          {(['light', 'dark', 'system'] as Theme[]).map((key) => (
            <SelectItem value={key} key={key}>
              <span className="inline-flex items-center gap-2">
                {themeLabels[key].icon}
                {showLabel && themeLabels[key].label}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
