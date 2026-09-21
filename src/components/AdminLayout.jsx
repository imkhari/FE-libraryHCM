import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { 
  HiMenuAlt2, 
  HiX, 
  HiChartBar, 
  HiDocumentText, 
  HiPlusCircle, 
  HiUsers, 
  HiArrowLeft, 
  HiLogout,
  HiShieldCheck
} from 'react-icons/hi';

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();

  const adminName = localStorage.getItem('adminName') || 'Thầy/Cô';
  const userRole = localStorage.getItem('userRole');

  // LỌC MENU THEO QUYỀN (Chỉ SUPER_ADMIN mới thấy Quản lý Nhân sự)
  const menuItems = [
    { name: 'Thống Kê', path: '/admin/dashboard', icon: <HiChartBar /> },
    { name: 'Quản lý bài viết', path: '/admin/articles', icon: <HiDocumentText /> },
    { name: 'Đăng bài mới', path: '/admin/create-post', icon: <HiPlusCircle /> },
    ...(userRole === 'SUPER_ADMIN' ? [{ name: 'Quản lý Nhân sự', path: '/admin/users', icon: <HiUsers /> }] : [])
  ];

  const isMenuItemActive = (path) => {
    if (path === '/admin/articles') {
      return location.pathname.startsWith('/admin/articles') || location.pathname.startsWith('/admin/edit-post');
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    localStorage.removeItem('userRole');
    window.location.href = '/admin/login';
  };

  const getPageTitle = () => {
    if (location.pathname.startsWith('/admin/dashboard')) return 'Tổng quan Thống kê';
    if (location.pathname.startsWith('/admin/articles')) return 'Quản lý Bài viết';
    if (location.pathname.startsWith('/admin/create-post')) return 'Soạn thảo & Đăng bài';
    if (location.pathname.startsWith('/admin/edit-post')) return 'Chỉnh sửa Bài viết';
    if (location.pathname.startsWith('/admin/users')) return 'Quản lý Nhân sự';
    return 'Khu vực Quản trị';
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] flex font-['Lora',serif] text-stone-800 antialiased selection:bg-red-200">

      <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 3500 }} />

      {/* Nút Hamburger Mobile */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white/90 backdrop-blur-md text-stone-700 rounded-full shadow-md border border-stone-200 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer"
        title="Mở menu quản trị"
      >
        <HiMenuAlt2 size={22} />
      </button>

      {/* Lớp phủ mờ khi mở menu trên điện thoại */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-stone-900/50 z-40 md:hidden backdrop-blur-xs"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-stone-200/80
        transform transition-transform duration-300 ease-in-out flex flex-col shadow-sm
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        {/* LOGO & TIÊU ĐỀ HỆ THỐNG */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-stone-100 bg-[#fdfcf9]">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-700 to-red-900 rounded-xl flex items-center justify-center text-white shadow-sm ring-2 ring-red-100/50 shrink-0">
              <span className="text-xl">🏛️</span>
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-stone-900 leading-tight">
                Không Gian Hồ Chí Minh
              </h2>
              <p className="text-[11px] text-red-700 font-medium tracking-wide">
                THPT Thái Phiên - Thăng Bình
              </p>
            </div>
          </Link>
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden p-1.5 text-stone-400 hover:bg-stone-100 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
          >
            <HiX size={20} />
          </button>
        </div>

        {/* DANH SÁCH MENU ĐIỀU HƯỚNG */}
        <nav className="flex-1 pt-6 px-3.5 space-y-1.5 overflow-y-auto font-sans">
          <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
            Mục Quản Trị
          </p>

          {menuItems.map((item) => {
            const isActive = isMenuItemActive(item.path);
            return (
              <Link
                key={item.path} 
                to={item.path} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 group text-xs font-semibold ${
                  isActive
                    ? 'bg-red-50/90 text-red-800 font-bold border border-red-200/80 shadow-2xs'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-red-700'
                }`}
              >
                <span className={`text-lg transition-transform duration-200 shrink-0 ${
                  isActive ? 'text-red-700' : 'text-stone-400 group-hover:text-red-700 group-hover:scale-105'
                }`}>
                  {item.icon}
                </span>
                <span className="tracking-wide font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* CHÂN SIDEBAR: NÚT VỀ TRANG CHỦ & NÚT ĐĂNG XUẤT */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/60 font-sans space-y-2">
          <Link 
            to="/" 
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-stone-200 text-stone-600 hover:text-red-700 hover:border-red-200 hover:bg-red-50/40 rounded-xl text-xs font-bold transition-all shadow-2xs"
          >
            <HiArrowLeft className="w-3.5 h-3.5" /> Về trang chủ Web
          </Link>

          <button 
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-stone-200 text-stone-500 hover:text-red-700 hover:border-red-200 hover:bg-red-50/40 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <HiLogout className="w-3.5 h-3.5" /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="flex-1 w-full min-w-0 flex flex-col h-screen overflow-hidden">

        {/* HEADER TOP BAR */}
        <header className="hidden md:flex h-20 shrink-0 items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-30 transition-all">
          
          {/* Breadcrumb / Page Title */}
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-700"></span>
            <h1 className="font-bold text-stone-800 text-base">
              {getPageTitle()}
            </h1>
          </div>

          {/* User Badge & Quick Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-stone-50/80 px-4 py-1.5 rounded-full border border-stone-200/80 shadow-2xs">
              <div className="text-right font-sans">
                <p className="text-xs font-bold text-stone-900 leading-tight">
                  {adminName}
                </p>
                <p className="text-[10px] text-red-700 font-semibold tracking-wider uppercase flex items-center justify-end gap-1">
                  <HiShieldCheck className="w-3 h-3 text-red-600" />
                  {userRole === 'SUPER_ADMIN' ? 'Quản trị tối cao' : 'Quản trị viên'}
                </p>
              </div>

              <div className="w-9 h-9 bg-gradient-to-br from-red-700 to-red-900 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-inner">
                {adminName.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Nút Đăng xuất nhanh ở Header */}
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              title="Đăng xuất khỏi hệ thống"
              className="p-2.5 bg-stone-50 hover:bg-red-50 text-stone-500 hover:text-red-700 border border-stone-200 hover:border-red-200 rounded-full transition-all cursor-pointer shadow-2xs"
            >
              <HiLogout className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* VÙNG NỘI DUNG CUỘN */}
        <div className="flex-1 p-4 md:p-8 pt-16 md:pt-8 overflow-y-auto w-full">
          {children}
        </div>
      </main>

      {/* MODAL XÁC NHẬN ĐĂNG XUẤT */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-stone-200 text-center"
            >
              <div className="w-14 h-14 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-2xs">
                <HiLogout className="w-7 h-7" />
              </div>

              <h3 className="font-bold text-stone-900 text-base mb-1 font-['Lora',serif]">
                Xác nhận đăng xuất
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed mb-6">
                Thầy/Cô có chắc chắn muốn rời khỏi phiên quản trị hệ thống không?
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Ở lại
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  Đăng xuất ngay
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}