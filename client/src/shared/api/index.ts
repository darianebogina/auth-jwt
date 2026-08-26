import * as axios from "axios";
import type {AxiosError, InternalAxiosRequestConfig} from "axios";

// shared — самый нижний слой FSD, ему нельзя знать про entities/session (это выше по слоям).
// Поэтому вместо прямого импорта sessionModel здесь просто "розетка": кто угодно сверху
// (в нашем случае entities/session/model) регистрирует себя через setAuthAdapter один раз
// при инициализации, а api дальше работает только с этим интерфейсом.
type AuthAdapter = {
    getAccessToken: () => string | null;
    setSession: (session: { accessToken: string; email: string }) => void;
    clearSession: () => void;
};

let authAdapter: AuthAdapter | null = null;

export const setAuthAdapter = (adapter: AuthAdapter) => {
    authAdapter = adapter;
};

type RetriableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = authAdapter?.getAccessToken() ?? null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetriableRequest | undefined;
        const status = error.response?.status;

        if (status !== 401 || !originalRequest) throw error;

        if (originalRequest._retry) {
            authAdapter?.clearSession();
            throw error;
        }

        if (originalRequest.url?.includes('/api/auth/refresh')) {
            authAdapter?.clearSession();
            throw error;
        }

        if (originalRequest.url?.includes('/api/auth/login')) {
            throw error;
        }

        originalRequest._retry = true;

        try {
            refreshPromise ??= api
                .post<{ accessToken: string; email: string }>('/api/auth/refresh')
                .then((response) => {
                    authAdapter?.setSession({
                        accessToken: response.data.accessToken,
                        email: response.data.email,
                    });
                    return response.data.accessToken;
                })
                .finally(() => {
                    refreshPromise = null;
                });

            await refreshPromise;

            return api(originalRequest);
        } catch (refreshError) {
            authAdapter?.clearSession();
            throw refreshError;
        }
    },
);

export default api;