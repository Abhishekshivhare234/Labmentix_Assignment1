import axios from 'axios';

const API_BASE ='http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send cookies for auth
});

export default api;
