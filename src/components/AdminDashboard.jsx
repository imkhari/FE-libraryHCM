import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  HiAcademicCap,
  HiIdentification,
  HiUserGroup,
  HiLibrary,
  HiSpeakerphone,
  HiSparkles,
  HiStar
} from 'react-icons/hi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    TOTAL: 0, TEACHER: 0, STUDENT: 0, GUEST: 0, PARTY_MEMBER: 0,
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

  if (loading) return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="animate-pulse text-lg font-bold text-slate-400 tracking-widest uppercase">Đang tải dữ liệu...</div>
    </div>
  );

  return (
    <div className="w-full max-w-full space-y-8 animate-fade-in font-sans">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Bảng Thống Kê</h1>
          <p className="text-sm text-slate-500 mt-1">Tổng quan hoạt động hệ thống hôm nay.</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminName');
            localStorage.removeItem('userRole');
            window.location.href = '/admin/login';
          }}
          className="w-full sm:w-auto px-6 py-2.5 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 rounded-xl font-bold text-sm transition-colors border border-red-100 hover:border-red-600 shadow-sm"
        >
          Đăng xuất
        </button>
      </div>

      {/* SECTION 1: LƯỢT TRUY CẬP (Đã đổi thành grid 4 cột) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        
        {/* Card Học Sinh (Màu Xanh dương) */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md hover:border-blue-200 transition-all">
          <div>
            <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1">Lượt truy cập</p>
            <p className="text-blue-600 font-bold text-sm mb-1">HỌC SINH</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter">{stats.STUDENT || 0}</h2>
          </div>
          <div className="opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
            <HiAcademicCap className="w-14 h-14 md:w-16 md:h-16 text-blue-500 drop-shadow-sm" />
          </div>
        </div>

        {/* Card Giáo Viên (Đổi sang màu Xanh ngọc cho đồng bộ Tracker) */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md hover:border-emerald-200 transition-all">
          <div>
            <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1">Lượt truy cập</p>
            <p className="text-emerald-600 font-bold text-sm mb-1">GIÁO VIÊN</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter">{stats.TEACHER || 0}</h2>
          </div>
          <div className="opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
            <HiIdentification className="w-14 h-14 md:w-16 md:h-16 text-emerald-500 drop-shadow-sm" />
          </div>
        </div>

        {/* Card Đảng Viên (Màu Đỏ) */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md hover:border-red-200 transition-all">
          <div>
            <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1">Lượt truy cập</p>
            <p className="text-red-600 font-bold text-sm mb-1">ĐẢNG VIÊN</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter">{stats.PARTY_MEMBER || 0}</h2>
          </div>
          <div className="opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
            <HiStar className="w-14 h-14 md:w-16 md:h-16 text-red-500 drop-shadow-sm" />
          </div>
        </div>

        {/* Card Khách (Màu Xám Slate) */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center justify-between group hover:shadow-md hover:border-slate-300 transition-all">
          <div>
            <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1">Lượt truy cập</p>
            <p className="text-slate-600 font-bold text-sm mb-1">KHÁCH</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter">{stats.GUEST || 0}</h2>
          </div>
          <div className="opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
            <HiUserGroup className="w-14 h-14 md:w-16 md:h-16 text-slate-500 drop-shadow-sm" />
          </div>
        </div>

      </div>

      {/* SECTION 2: BÀI VIẾT */}
      <div className="pt-4 border-t border-slate-200/60">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 ml-1 flex items-center gap-2">
          <span className="w-2 h-2 bg-slate-300 rounded-full"></span> Kho Nội Dung
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {/* Card Tổng bài viết */}
          <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 p-6 rounded-2xl shadow-sm flex items-center justify-between group">
            <div>
              <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mb-1">TỔNG BÀI VIẾT</p>
              <h2 className="text-4xl md:text-5xl font-black text-indigo-700 tracking-tighter">{stats.TOTAL_ARTICLES || 0}</h2>
            </div>
            <div className="opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              <HiLibrary className="w-14 h-14 md:w-16 md:h-16 text-indigo-500 drop-shadow-sm" />
            </div>
          </div>

          {/* Card Tin tức */}
          <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 p-6 rounded-2xl shadow-sm flex items-center justify-between group">
            <div>
              <p className="text-amber-600 font-bold text-xs uppercase tracking-widest mb-1">TIN TỨC - SỰ KIỆN</p>
              <h2 className="text-4xl md:text-5xl font-black text-amber-700 tracking-tighter">{stats.ARTICLE_TIN_TUC || 0}</h2>
            </div>
            <div className="opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              <HiSpeakerphone className="w-14 h-14 md:w-16 md:h-16 text-amber-500 drop-shadow-sm" />
            </div>
          </div>

          {/* Card Học tập Bác */}
          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 p-6 rounded-2xl shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1 group">
            <div>
              <p className="text-purple-600 font-bold text-xs uppercase tracking-widest mb-1">HỌC TẬP BÁC</p>
              <h2 className="text-4xl md:text-5xl font-black text-purple-700 tracking-tighter">{stats.ARTICLE_HOC_TAP_BAC || 0}</h2>
            </div>
            <div className="opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              <HiSparkles className="w-14 h-14 md:w-16 md:h-16 text-purple-500 drop-shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* TỔNG KẾT */}
      <div className="bg-slate-800 p-6 md:p-8 rounded-2xl shadow-lg border border-slate-700 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
        <p className="text-base md:text-lg font-medium relative z-10">
          Tổng cộng đã có <span className="font-black text-emerald-400 text-2xl md:text-3xl mx-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">{stats.TOTAL || 0}</span> lượt truy cập và
          <span className="font-black text-amber-400 text-2xl md:text-3xl mx-2 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">{stats.TOTAL_ARTICLES || 0}</span> bài viết trên hệ thống.
        </p>
      </div>

    </div>
  );
}