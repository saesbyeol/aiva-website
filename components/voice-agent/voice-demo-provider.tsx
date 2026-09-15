"use client";

import * as React from "react";

/**
 * Whether the visitor has explicitly started the voice demo.
 *
 * This gate is deliberately separate from the cookie banner. Loading the
 * ElevenLabs embed transmits the visitor's IP to a US processor and opens a
 * microphone prompt, which needs consent that is specific to that purpose —
 * not a blanket "accept all" click. Keeping it separate also means a visitor
 * who declines cookies can still try the demo, which is the point of the page.
 *
 * Activation is intentionally one-way for the life of the page: once the
 * embed has loaded there is nothing to un-load, so offering a "stop" that
 * cannot honour its promise would be worse than not offering one.
 */
type VoiceDemo = { activated: boolean; activate: () => void };

const VoiceDemoContext = React.createContext<VoiceDemo>({
  activated: false,
  activate: () => {},
});

export function useVoiceDemo(): VoiceDemo {
  return React.useContext(VoiceDemoContext);
}

export function VoiceDemoProvider({ children }: { children: React.ReactNode }) {
  const [activated, setActivated] = React.useState(false);
  const activate = React.useCallback(() => setActivated(true), []);
  const value = React.useMemo(() => ({ activated, activate }), [activated, activate]);

  return <VoiceDemoContext.Provider value={value}>{children}</VoiceDemoContext.Provider>;
}
