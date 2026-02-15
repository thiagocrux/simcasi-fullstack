import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * Hook to determine if the device viewport matches the mobile breakpoint.
 * Uses matchMedia for efficient window resizing updates.
 * @return True if the viewport is mobile-sized, otherwise false.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(function setupMobileCheck() {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    /**
     * Updates the mobile state based on current window dimensions.
     */
    function checkMobile(): void {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    }

    mql.addEventListener('change', checkMobile);
    checkMobile();

    return function cleanup() {
      mql.removeEventListener('change', checkMobile);
    };
  }, []);

  return !!isMobile;
}
