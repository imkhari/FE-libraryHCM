import axios from 'axios';

// Tạo một instance của axios trỏ về Backend Spring Boot của bạn
const api = axios.create({
  // Nhớ kiểm tra lại xem Backend của bạn đang chạy port 8080 hay cổng khác nhé
  baseURL: 'https://api-khong-gian-van-hoa.onrender.com/api/v1', 
  headers: {
    'Content-Type': 'application/json',
  }
});

// Đây chính là dòng export default mà Home.jsx đang "đòi"
export default api;