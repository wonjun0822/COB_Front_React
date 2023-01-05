import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:44356/",
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
});

api.interceptors.request.use(
    request => {
        const token = localStorage.getItem("token");

        if (token) {
            request.headers!.Authorization = `Bearer ${token}`;
        }

        return request;
    }
)

api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        const originalConfig = error.config;

        if (error.response.status === 401 && !originalConfig._retry) {
            originalConfig._retry = true;

            try {
                api({
                    method: 'post',
                    url: '/Login/ReissuanceToken'
                }).then((response) => {
                    const accessToken = response.data;
    
                    localStorage.setItem("token", accessToken);
    
                    return api(originalConfig);
                });
            }

            catch(_error) {
                return Promise.reject(_error);
            }
        }

        else if (error.response.status === 401) {
            localStorage.clear();

            window.dispatchEvent(new Event("storage"));
        }

        return Promise.reject(error);
    }
)

export default api;