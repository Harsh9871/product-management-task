import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Auth APIs
export const signup = (data) => API.post('/auth/signup', data);
export const verifyOtp = (data) => API.post('/auth/verify-otp', data);
export const resendOtp = (data) => API.post('/auth/resend-otp', data);
export const login = (data) => API.post('/auth/login', data);

// Product APIs (with JWT)
export const getProducts = () => API.get('/products');
export const createProduct = (data, token) =>
  API.post('/products', data, { headers: { Authorization: `Bearer ${token}` } });
export const updateProduct = (id, data, token) =>
  API.put(`/products/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteProduct = (id, token) =>
  API.delete(`/products/${id}`, { headers: { Authorization: `Bearer ${token}` } });
export default API;