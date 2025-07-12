// utils/axios.ts
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { toast } from "react-toastify";

// Tạo instance axios
const instance = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
    timeout: 30000, // 30 giây timeout
});

// Quản lý handlers
let logoutFromContext: (() => void) | null = null;
let navigateToSignIn: (() => void) | null = null;

export const setLogoutHandler = (fn: () => void) => {
    logoutFromContext = fn;
};

export const setNavigateHandler = (fn: () => void) => {
    navigateToSignIn = fn;
};

// Hệ thống queue cho refresh token
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });
    failedQueue = [];
};

// Request interceptor để thêm token vào header
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Có thể thêm logic để tự động thêm access token vào header nếu cần
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
instance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Kiểm tra các điều kiện cần thiết
        if (
            !originalRequest ||
            error.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest.url?.includes('/refresh-token') // Tránh infinite loop
        ) {
            return Promise.reject(error);
        }

        // Nếu đang refresh token, đưa request vào queue
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve: (token: string) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        resolve(instance(originalRequest));
                    },
                    reject: (err: any) => {
                        reject(err);
                    },
                });
            });
        }

        // Đánh dấu request đã retry và bắt đầu refresh
        originalRequest._retry = true;
        isRefreshing = true;

        try {
            console.log("🔄 Attempting to refresh token...");

            const refreshResponse = await axios.post(
                "http://localhost:3000/api/Auth/refresh-token",
                {},
                {
                    withCredentials: true,
                    timeout: 10000 // 10 giây timeout cho refresh
                }
            );

            const newAccessToken = refreshResponse.data.accessToken;
            console.log("✅ Token refreshed successfully");

            // Xử lý tất cả request trong queue
            processQueue(null, newAccessToken);

            // Thêm token mới vào request gốc
            if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }

            // Retry request gốc
            return instance(originalRequest);

        } catch (refreshError) {
            console.error("❌ Failed to refresh token:", refreshError);

            // Xử lý tất cả request trong queue với lỗi
            processQueue(refreshError, null);

            // Hiển thị thông báo và điều hướng
            const errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
            toast.error(errorMessage);

            // Thực hiện logout
            if (logoutFromContext) {
                console.log("🚪 Logging out user...");
                logoutFromContext();
            }

            // Điều hướng về trang đăng nhập
            if (navigateToSignIn) {
                console.log("👉 Navigating to sign in page...");
                setTimeout(() => {
                    navigateToSignIn!();
                }, 100); // Delay nhỏ để đảm bảo logout hoàn tất
            } else {
                console.warn("⚠️ navigateToSignIn handler is not set!");
            }

            return Promise.reject(refreshError);

        } finally {
            isRefreshing = false;
        }
    }
);

// Utility function để clear handlers khi cần
export const clearHandlers = () => {
    logoutFromContext = null;
    navigateToSignIn = null;
};

// Utility function để kiểm tra trạng thái refresh
export const getRefreshStatus = () => ({
    isRefreshing,
    queueLength: failedQueue.length,
});

export default instance;
