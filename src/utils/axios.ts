// utils/axios.ts
import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

// Tạo biến lưu context (phải inject từ component React)
let logoutFromContext: (() => void) | null = null;
export const setLogoutHandler = (fn: () => void) => {
    logoutFromContext = fn;
};

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        token ? prom.resolve(token) : prom.reject(error);
    });
    failedQueue = [];
};

instance.interceptors.response.use(
    res => res,
    async err => {
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
                const res = await instance.post("/Auth/refresh-token");
                const newAccessToken = res.data.accessToken;

                // Có thể set vào localStorage hoặc context (tuỳ bạn)
                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return instance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);

                // GỌI LOGOUT KHI REFRESH THẤT BẠI
                if (logoutFromContext) {
                    console.log("👉 Logout from context triggered.");
                    toast.error("Your session expired");
                    logoutFromContext();
                } else {
                    console.warn("⚠️ logoutFromContext is NULL!");
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
