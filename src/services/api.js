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

// Interceptor xử lý khi Token hết hạn hoặc không hợp lệ (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isLoginRequest = error.config && error.config.url && error.config.url.includes('/auth/login');
      if (!isLoginRequest) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminName');
        localStorage.removeItem('userRole');
        
        // Nếu đang ở trong các trang admin thì chuyển về trang đăng nhập
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
          window.location.href = '/admin/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;