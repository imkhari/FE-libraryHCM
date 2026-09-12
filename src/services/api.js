import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor tự động lấy Token từ ổ khóa gắn vào mọi Request
api.interceptors.request.use(
  (config) => {
    // Tìm thẻ adminToken trong bộ nhớ trình duyệt
    const token = localStorage.getItem('adminToken');
    
    // Nếu có thẻ, tự động kẹp vào dòng Authorization của Header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;