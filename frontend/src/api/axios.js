import axios from 'axios'


// Handle the base URL so you don't repeat it everywhere
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api"
});


// automatically attaching JWT tokekn to every request
API.interceptors.request.use((req) => {

    const token = localStorage.getItem('token');

    if(token){
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

export default API;