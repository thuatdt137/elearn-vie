// utils/axios.ts
import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

let logoutFromContext: (() => void) | null = null;
let navigateToSignIn: (() => void) | null = null;

export const setLogoutHandler = (fn: () => void) => {
    logoutFromContext = fn;
};

export const setNavigateHandler = (fn: () => void) => {
    navigateToSignIn = fn;
};

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        token ? prom.resolve(token) : prom.reject(error);
    });
    failedQueue = [];
};

instance.interceptors.response.use(
    (res) => res,
    async (err) => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(instance(originalRequest));
                        },
                        reject: (err: any) => reject(err),
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await axios.post("/Auth/refresh-token",
                    { withCredentials: true, }
                );
                if (res.status === 401) {
                    console.error("Failed to refresh token:", res);
                }
                const newAccessToken = res.data.accessToken;
                processQueue(null, newAccessToken);
                return instance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                if (navigateToSignIn) {
                    console.log("👉 Navigating to signin due to invalid tokens.");
                    toast.error("Your session has expired. Please sign in again.");
                    navigateToSignIn();
                } else {
                    console.warn("⚠️ navigateToSignIn is NULL!");
                    toast.error("Your session has expired. Please sign in again.");
                }
                if (logoutFromContext) {
                    logoutFromContext();
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(err);
    }
);

export default instance;