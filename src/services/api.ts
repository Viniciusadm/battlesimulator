import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

api.interceptors.response.use(response => {
    return response;
}, error => {
    console.log(error);
});

export default api;