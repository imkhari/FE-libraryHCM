import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  // ĐÃ SỬA: Thêm các biến đếm bài viết vào State mặc định
  const [stats, setStats] = useState({ 
    TOTAL: 0, TEACHER: 0, STUDENT: 0, GUEST: 0,
    TOTAL_ARTICLES: 0, ARTICLE_TIN_TUC: 0, ARTICLE_HOC_TAP_BAC: 0 
  });
  
  const [loading, setLoading] = useState(true);
  const adminName = localStorage.getItem('adminName') || 'Thầy/Cô';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/analytics/summary');
        setStats(response.data);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu thống kê", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center text-xl font-bold text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bảng Thống Kê</h1>
          <p className="text-gray-500">Xin chào, {adminName}!</p>
        </div>
        <button onClick={() => { localStorage.clear(); window.location.href='/admin/login'; }} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold">Đăng xuất</button>
      </div>

      {/* GIỮ NGUYÊN: Hàng thống kê LƯỢT TRUY CẬP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border-l-8 border-blue-500 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div><p className="text-blue-800 font-bold mb-1">Lượt truy cập: HỌC SINH</p><h2 className="text-5xl font-black text-blue-600">{stats.STUDENT || 0}</h2></div><div className="text-5xl">👨‍🎓</div>
        </div>
        <div className="bg-red-50 border-l-8 border-red-500 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div><p className="text-red-800 font-bold mb-1">Lượt truy cập: GIÁO VIÊN</p><h2 className="text-5xl font-black text-red-600">{stats.TEACHER || 0}</h2></div><div className="text-5xl">👨‍🏫</div>
        </div>
        <div className="bg-gray-50 border-l-8 border-gray-500 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div><p className="text-gray-800 font-bold mb-1">Lượt truy cập: KHÁCH</p><h2 className="text-5xl font-black text-gray-600">{stats.GUEST || 0}</h2></div><div className="text-5xl">👤</div>
        </div>
      </div>

      {/* THÊM MỚI: Hàng thống kê BÀI VIẾT (Phong cách giống hệt ở trên) */}
      <h2 className="text-xl font-bold text-gray-700 mt-10 mb-4 border-b pb-2">NỘI DUNG BÀI VIẾT</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border-l-8 border-green-500 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div><p className="text-green-800 font-bold mb-1">TỔNG BÀI VIẾT</p><h2 className="text-5xl font-black text-green-600">{stats.TOTAL_ARTICLES || 0}</h2></div><div className="text-5xl">📚</div>
        </div>
        <div className="bg-yellow-50 border-l-8 border-yellow-500 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div><p className="text-yellow-800 font-bold mb-1">TIN TỨC - SỰ KIỆN</p><h2 className="text-5xl font-black text-yellow-600">{stats.ARTICLE_TIN_TUC || 0}</h2></div><div className="text-5xl">📢</div>
        </div>
        <div className="bg-purple-50 border-l-8 border-purple-500 p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div><p className="text-purple-800 font-bold mb-1">HỌC TẬP BÁC</p><h2 className="text-5xl font-black text-purple-600">{stats.ARTICLE_HOC_TAP_BAC || 0}</h2></div><div className="text-5xl">🌟</div>
        </div>
      </div>
      
      {/* GIỮ NGUYÊN: Dòng tổng kết */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-sm border text-center">
        <p className="text-xl text-gray-700">Tổng cộng đã có <span className="font-bold text-red-600 text-2xl mx-2">{stats.TOTAL || 0}</span> lượt xem trang web và <span className="font-bold text-red-600 text-2xl mx-2">{stats.TOTAL_ARTICLES || 0}</span> bài viết.</p>
      </div>
      
    </div>
  );
}