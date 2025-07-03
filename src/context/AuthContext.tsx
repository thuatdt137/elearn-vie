// contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/api";
import instance from "../utils/axios";

interface AuthContextType {
    accessToken: string | null;
    user: UserInfo | null;
    setAccessToken: (token: string | null) => void;
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
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true); // thêm state loading

    const logout = () => {
        setAccessToken(null);
        setUser(null);
        setLoading(false);
        instance.post("/Auth/logout", null, { withCredentials: true });
        window.location.href = "/signin";
    };

    useEffect(() => {
        const path = window.location.pathname;
        if (path === "/signin") {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await getCurrentUser();
                setUser(res.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);


    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, user, setUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
