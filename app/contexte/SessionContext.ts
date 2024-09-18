import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession, Session } from "next-auth/react";

// Type pour le contexte
interface SessionContextType {
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

// Contexte
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Provider
export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [contextValue, setContextValue] = useState<SessionContextType>({
    session: null,
    status: "loading",
  });

  useEffect(() => {
    setContextValue({ session, status });
  }, [session, status]);

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

// Hook personnalisé
export const useCustomSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useCustomSession must be used within a SessionProvider");
  }
  return context;
};
