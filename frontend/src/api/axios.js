import axios from 'axios'


// Hanle the base URL so you don't repeat it everywhere
const API = axios.create({
    baseURL: 'http://localhost:3000/api'
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