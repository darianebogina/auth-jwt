import { useSyncExternalStore } from 'react';
import { createStore } from '@/shared/lib/create-store';
import api from '@/shared/api';
import axios from "axios";

export type Session = { email: string; accessToken: string } | null;

type SessionState = {
    session: Session;
    isInitialized: boolean;
};

const sessionStore = createStore<SessionState>({
    session: null,
    isInitialized: false,
});

let initPromise: Promise<void> | null = null;

const init = () => {
    if (initPromise) return initPromise;

    initPromise = api
        .post<{ accessToken: string; email: string }>('/api/auth/refresh')
        .then(({ data }) => {
            sessionStore.setState({
                session: { accessToken: data.accessToken, email: data.email },
                isInitialized: true,
            });
        })
        .catch(() => {
            sessionStore.setState((state) => ({ ...state, isInitialized: true }));
        });

    return initPromise;
};

type AuthResponse = { accessToken: string; email: string };

export type LoginResult =
    | { ok: true }
    | { ok: false; reason: 'invalid-credentials' };

const login = async (credentials: { email: string; password: string }): Promise<LoginResult> => {
    try {
        const { data } = await api.post<AuthResponse>('/api/auth/login', credentials);
        sessionStore.setState((state) => ({
            ...state,
            session: { accessToken: data.accessToken, email: data.email },
        }));
        return { ok: true };
    } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
            return { ok: false, reason: 'invalid-credentials' };
        }
        throw err;
    }
};

const logout = async () => {
    try {
        await api.post('/api/auth/logout');
    } finally {
        sessionStore.setState((state) => ({ ...state, session: null }));
    }
};

const useSession = () =>
    useSyncExternalStore(
        sessionStore.subscribe,
        sessionStore.getState,
        sessionStore.getState,
    );

export const sessionModel = {
    init,
    login,
    logout,
    useSession,
};