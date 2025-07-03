// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCurrentUser } from "../api/api";
import instance, { setNavigateHandler } from "../utils/axios";

interface AuthContextType {
    user: UserInfo | null;
    setUser: (user: UserInfo | null) => void;
    logout: () => void;
    loading: boolean;
}

interface UserInfo {
    id: number;
    username: string;
    role: string;
    email?: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserInfo | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const logout = async () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.setItem("isLoggedOut", "true");
        try {
            await instance.post("/Auth/logout", null, { withCredentials: true });
            toast.success("Đăng xuất thành công!");
        } catch (err) {
            console.error("Logout failed:", err);
            toast.error("Đăng xuất thất bại, vui lòng thử lại.");
        }
        navigate("/signin", { replace: true });
    };

    useEffect(() => {
        console.log("AuthContext useEffect: user =", user, "loading =", loading); // Debug
        setNavigateHandler(() => navigate("/signin", { replace: true }));

        const path = window.location.pathname;
        if (path === "/signin" || path === "/signup") {
            setLoading(false);
            if (user) {
                console.log("Redirecting from /signin to / due to user existing"); // Debug
                navigate("/", { replace: true });
            }
            return;
        }

        const fetchUser = async () => {
            const storedUser = localStorage.getItem("user");
            const isLoggedOut = localStorage.getItem("isLoggedOut");

            if (storedUser && !isLoggedOut) {
                console.log("Using stored user:", JSON.parse(storedUser)); // Debug
                setUser(JSON.parse(storedUser));
                setLoading(false);
                localStorage.removeItem("isLoggedOut");
                return;
            }

            // Nếu không có storedUser, thử gọi API để khôi phục user
            try {
                console.log("Attempting to fetch user from API"); // Debug
                const res = await getCurrentUser();
                console.log("Fetched user:", res.data); // Debug
                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data));
                localStorage.removeItem("isLoggedOut");
            } catch (err: any) {
                console.error("Error fetching user:", err);
                setUser(null);
                localStorage.removeItem("user");
                localStorage.setItem("isLoggedOut", "true");
                navigate("/signin", { replace: false });
            } finally {
                setLoading(false);
            }
        };

        fetchUser().catch((err) => {
            console.error("Unhandled error in fetchUser:", err);
            setLoading(false);
            setUser(null);
            localStorage.setItem("isLoggedOut", "true");
            navigate("/signin", { replace: true });
        });
    }, [navigate]);

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};