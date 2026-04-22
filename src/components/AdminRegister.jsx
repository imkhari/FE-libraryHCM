import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import BackgroundADMIN from '../assets/bg4.jpeg';

export default function AdminRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    secretCode: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const backgroundImageUrl = BackgroundADMIN;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      setMessage({ type: 'success', text: response.data || 'Đăng ký thành công! Đang chuyển trang...' });
      
      // Đợi 2 giây cho Thầy Cô đọc thông báo rồi mới đá về trang Đăng nhập
      setTimeout(() => navigate('/admin/login'), 2000);
      
    } catch (err) {
      const errorMsg = err.response?.data || 'Lỗi kết nối máy chủ.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative font-['Lora',serif]"
      style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 animate-fade-in border-t-4 border-red-700">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-wide">Tạo Tài Khoản</h1>
          <p className="text-gray-500 mt-2 text-sm">Dành cho Cán bộ / Giáo viên</p>
        </div>

        {message.text && (
          <div className={`px-4 py-3 rounded mb-6 text-sm shadow-sm border-l-4 ${message.type === 'error' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-green-50 border-green-500 text-green-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-1 text-xs uppercase">Họ và tên</label>
            <input type="text" name="fullName" required onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/50 outline-none bg-gray-50 focus:bg-white" placeholder="VD: Nguyễn Văn A" />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1 text-xs uppercase">Tên đăng nhập</label>
            <input type="text" name="username" required onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/50 outline-none bg-gray-50 focus:bg-white" placeholder="Viết liền không dấu..." />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-1 text-xs uppercase">Mật khẩu</label>
            <input type="password" name="password" required onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/50 outline-none bg-gray-50 focus:bg-white" placeholder="Nhập mật khẩu..." />
          </div>
          <div>
            <label className="block text-red-700 font-bold mb-1 text-xs uppercase">Mã bảo mật nội bộ (*)</label>
            <input type="password" name="secretCode" required onChange={handleChange} className="w-full p-3 border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500/50 outline-none bg-red-50 focus:bg-white" placeholder="Mã do trường cấp..." />
          </div>

          <button type="submit" disabled={isLoading} className={`mt-4 w-full py-3 text-white font-black tracking-wider uppercase rounded-xl transition-all shadow-lg ${isLoading ? 'bg-red-400' : 'bg-red-700 hover:bg-red-800'}`}>
            {isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ NGAY'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Đã có tài khoản? <Link to="/admin/login" className="text-red-700 font-bold hover:underline">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}