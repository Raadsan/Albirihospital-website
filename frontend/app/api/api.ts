import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export const adminApi = axios.create({
    baseURL: "/api/admin",
    headers: { "X-Requested-With": "XMLHttpRequest" },
});

adminApi.interceptors.response.use((response) => response, (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 &&
        error.config?.url !== "/session" && typeof window !== "undefined") {
        window.location.replace("/admin/login");
    }
    return Promise.reject(error);
});

export default api;
export { api };
