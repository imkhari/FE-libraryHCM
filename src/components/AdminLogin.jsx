import React, { useState } from 'react';
import api from '../services/api'; 
import BackgroundADMIN from '../assets/bg4.jpeg';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const backgroundImageUrl = BackgroundADMIN; 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { 
        username: username, 
        password: password 
      });

      const { token, fullName } = response.data;
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminName', fullName);
      window.location.href = '/admin/dashboard';
      
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Sai tên đăng nhập hoặc mật khẩu. Vui lòng thử lại!');
      } else {
        setError('Lỗi kết nối máy chủ. Có thể server đang thức dậy, đợi xí nhé!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Lớp phủ đen mờ giúp form đăng nhập nổi bật lên */}
      {/* <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div> */}

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 animate-fade-in border-t-4 border-red-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-50 text-red-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-wide">Cổng Quản Trị</h1>
          <p className="text-gray-500 mt-2 text-sm font-['Lora',serif]">Không gian văn hóa Hồ Chí Minh</p>
        </div>

        {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 text-sm shadow-sm">{error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Tên đăng nhập</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all bg-gray-50 focus:bg-white" placeholder="Nhập tài khoản..." />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2 text-sm uppercase">Mật khẩu</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all bg-gray-50 focus:bg-white" placeholder="Nhập mật khẩu..." />
          </div>
          <button type="submit" disabled={isLoading} className={`mt-6 w-full py-4 text-white font-black tracking-wider uppercase rounded-xl transition-all shadow-lg ${isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800 hover:-translate-y-1 hover:shadow-red-700/30'}`}>
            {isLoading ? 'ĐANG XÁC THỰC...' : 'ĐĂNG NHẬP HỆ THỐNG'}
          </button>
        </form>
      </div>
    </div>
  );
}