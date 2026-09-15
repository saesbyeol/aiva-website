"use client";

import * as React from "react";

/**
 * Cookiebot's consent categories, mirrored into React state.
 *
 * Every field defaults to false and stays false unless Cookiebot tells us
 * otherwise, so a visitor whose Cookiebot request is blocked — by an ad
 * blocker, a privacy extension, or an unset NEXT_PUBLIC_COOKIEBOT_ID — is
 * treated as having consented to nothing. Failing closed is the only safe
 * default: the cost of a wrong `false` is a missing widget, the cost of a
 * wrong `true` is processing personal data with no lawful basis.
 */
export type Consent = {
  necessary: boolean;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
  hasResponded: boolean;
};

const DENIED: Consent = {
  necessary: false,
  preferences: false,
  statistics: false,
  marketing: false,
  hasResponded: false,
};

const ConsentContext = React.createContext<Consent>(DENIED);

export function useConsent(): Consent {
  return React.useContext(ConsentContext);
}

function read(): Consent {
  const cb = (
    window as unknown as {
      Cookiebot?: {
        consent?: Record<string, boolean>;
        hasResponse?: boolean;
      };
    }
  ).Cookiebot;
  if (!cb?.consent) return DENIED;
  return {
    necessary: !!cb.consent.necessary,
    preferences: !!cb.consent.preferences,
    statistics: !!cb.consent.statistics,
    marketing: !!cb.consent.marketing,
    hasResponded: !!cb.hasResponse,
  };
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = React.useState<Consent>(DENIED);

  React.useEffect(() => {
    const sync = () => setConsent(read());

    // Cookiebot may have loaded and fired before this effect ran, so read
    // once eagerly rather than waiting for an event that already passed.
    sync();

    const events = ["CookiebotOnAccept", "CookiebotOnDecline", "CookiebotOnLoad"];
    events.forEach((e) => window.addEventListener(e, sync));
    return () => events.forEach((e) => window.removeEventListener(e, sync));
  }, []);

  return <ConsentContext.Provider value={consent}>{children}</ConsentContext.Provider>;
}
