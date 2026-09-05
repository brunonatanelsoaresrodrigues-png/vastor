"use client";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { toast } from "sonner";
import { createSeed } from "@/mocks/seed";
import { reduceDemo, type DemoAction } from "@/lib/domain";
import type { DemoState, Role, Session } from "@/types";
const STATE_KEY = "vastor.demo.v1",
  SESSION_KEY = "vastor.session.v1";
type DemoContextType = {
  state: DemoState;
  ready: boolean;
  session: Session | null;
  dispatch: (a: DemoAction) => void;
  login: (r: Role, remember?: boolean) => void;
  logout: () => void;
  reset: () => void;
};
const DemoContext = createContext<DemoContextType | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(createSeed),
    [session, setSession] = useState<Session | null>(null),
    [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (
          saved.schemaVersion === 1 &&
          Array.isArray(saved.people) &&
          Array.isArray(saved.events) &&
          Array.isArray(saved.enrollments) &&
          saved.profile &&
          saved.preferences
        )
          setState(saved);
      }
      const rawSession = sessionStorage.getItem(SESSION_KEY) ?? localStorage.getItem(SESSION_KEY);
      if (rawSession) {
        const value = JSON.parse(rawSession);
        if (["professional", "company", "admin"].includes(value.role)) setSession(value);
      }
    } catch {
      toast.warning("Não foi possível restaurar a demo. Os dados iniciais foram carregados.");
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch {
      toast.warning("Armazenamento indisponível. As alterações durarão apenas nesta sessão.");
    }
  }, [state, ready]);
  const dispatch = useCallback((action: DemoAction) => setState((s) => reduceDemo(s, action)), []);
  const login = useCallback((role: Role, remember = true) => {
    const s: Session = {
      role,
      name:
        role === "professional"
          ? "Ana Ribeiro Martins"
          : role === "company"
            ? "Vetor Engenharia"
            : "Administrador Vastor Capital",
      email:
        role === "professional"
          ? "profissional@vastor.demo"
          : role === "company"
            ? "empresa@vastor.demo"
            : "admin@vastor.demo",
    };
    setSession(s);
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
      (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(s));
    } catch {
      toast.info("Sessão mantida apenas nesta janela.");
    }
  }, []);
  const logout = useCallback(() => {
    setSession(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch {}
  }, []);
  const reset = useCallback(() => {
    setState(createSeed());
    toast.success("Demonstração restaurada aos dados iniciais.");
  }, []);
  return (
    <DemoContext.Provider value={{ state, ready, session, dispatch, login, logout, reset }}>
      {children}
    </DemoContext.Provider>
  );
}
export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("DemoProvider ausente");
  return context;
}
