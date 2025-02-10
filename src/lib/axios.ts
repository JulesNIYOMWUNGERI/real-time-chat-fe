import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_PUBLIC_DEFAULT_API,
    withCredentials: true
});
