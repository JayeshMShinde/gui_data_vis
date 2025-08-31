"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SessionContextType {
  currentSessionId: string | null;
  setCurrentSessionId: (sessionId: string | null) => void;
  hasActiveSession: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  return (
    <SessionContext.Provider value={{
      currentSessionId,
      setCurrentSessionId,
      hasActiveSession: !!currentSessionId
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}