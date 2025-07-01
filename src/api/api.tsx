import instance from "../utils/axios";



export const getAllStudents = async ({ page, size }: { page: number; size: number }) => {
    const response = await instance.get(`/Students?pageNumber=${page}&pageSize=${size}`);
    return response.data;
};

export const getCurrentUser = async () => {
    const response = await instance.get('/Auth/me', {
        headers: {
            "Content-Type": "application/json",
            "X-Client-Platform": "web",
        }
    });
    return response.data;
};

export const postLogin = async ({ username, password }: { username: string; password: string }) => {
    const response = await instance.post("/Auth/login", {
        username,
        password
    }, {
        headers: {
            "Content-Type": "application/json",
            "X-Client-Platform": "web",
        }
    });

    return response.data;
};

export const postRefreshToken = async (refreshToken?: string) => {
    const response = await instance.post("/Auth/refresh-token",
        refreshToken ? { refreshToken } : {},
        {
            headers: {
                "X-Client-Platform": "web"
            },
            withCredentials: true
        }
    );

    return response.data;
};

export const postLogout = async () => {
    const response = await instance.post("/Auth/logout", {}, {
        withCredentials: true
    });
    return response.data;
};

