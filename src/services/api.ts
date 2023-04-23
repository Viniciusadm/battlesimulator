import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

api.interceptors.response.use(response => {
    return response;
}, error => {
    console.log(error);
});

export default api;