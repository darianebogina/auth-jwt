import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import api from "@/shared/api";
import axios from "axios";

export type Session = { email: string; accessToken: string } | null;

export type LoginResult =
    | { ok: true }
    | { ok: false; reason: 'invalid-credentials' };

type AuthResponse = { accessToken: string; email: string };

type SessionContextValue = {
    session: Session;
    isInitialized: boolean;
    login: (credentials: { email: string; password: string }) => Promise<LoginResult>;
    logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        api
            .post<AuthResponse>('/api/auth/refresh')
            .then(({ data }) => {
                setSession({ accessToken: data.accessToken, email: data.email });
            })
            .catch(() => {})
            .finally(() => {
                setIsInitialized(true);
            });
    }, []);

    const login = useCallback(async (credentials: { email: string; password: string }): Promise<LoginResult> => {
        try {
            const { data } = await api.post<AuthResponse>('/api/auth/login', credentials);
            setSession({ accessToken: data.accessToken, email: data.email });
            return { ok: true };
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                return { ok: false, reason: 'invalid-credentials' };
            }
            throw err;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post('/api/auth/logout');
        } finally {
            setSession(null);
        }
    }, []);

    return (
        <SessionContext.Provider value={{ session, isInitialized, login, logout }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
