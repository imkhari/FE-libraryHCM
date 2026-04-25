import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { HiMenuAlt2, HiX, HiChartBar, HiDocumentText, HiPlusCircle, HiUsers, HiArrowLeft } from 'react-icons/hi';

export default function AdminLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);
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

    return (
        <div className="min-h-screen bg-[#f4f7f6] flex font-['Lora',serif] text-slate-800">

            <Toaster position="top-right" reverseOrder={false} />

            {/* Nút Hamburger Mobile */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white/70 backdrop-blur-md text-slate-700 rounded-full shadow-lg border border-white/50 hover:bg-red-50 hover:text-red-600 transition-all"
            >
                <HiMenuAlt2 size={24} />
            </button>

            {/* Lớp phủ mờ khi mở menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* SIDEBAR */}
            <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200
        transform transition-transform duration-300 ease-in-out flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                            <span className="text-2xl">🏛️</span>
                        </div>
                        <div>
                            <h2 className="font-extrabold text-[15px] uppercase tracking-tight text-slate-800">Quản Trị Hệ Thống</h2>
                            <p className="text-[11px] text-slate-500 font-medium tracking-wide">THPT Thái Phiên</p>
                        </div>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="md:hidden p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 rounded-full transition-colors"><HiX size={20} /></button>
                </div>

                <nav className="flex-1 mt-6 px-4 space-y-1.5 overflow-y-auto">
                    <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Chức năng chính</p>

                    {menuItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path} to={item.path} onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-red-50 text-red-700 font-bold shadow-sm ring-1 ring-red-100'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-red-600 font-medium'
                                    }`}
                            >
                                <span className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </span>
                                <span className="text-sm tracking-wide">{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                    <Link to="/" className="flex items-center justify-center gap-2.5 w-full py-3 bg-white border border-slate-200 shadow-sm rounded-xl text-sm text-slate-600 hover:text-red-600 hover:border-red-200 hover:shadow transition-all font-bold">
                        <HiArrowLeft /> Về trang chủ Web
                    </Link>
                </div>
            </aside>

            {/* CONTENT AREA */}
            <main className="flex-1 w-full min-w-0 flex flex-col h-screen overflow-hidden">

                {/* HEADER DESKTOP */}
                <header className="hidden md:flex h-20 shrink-0 items-center justify-end px-8 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm sticky top-0 z-30 transition-all">
                    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-5 py-2 rounded-full border border-white shadow-[0_4px_10px_rgb(0,0,0,0.03)] cursor-pointer hover:shadow-md hover:border-red-100 transition-all group">
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-800 leading-tight group-hover:text-red-700 transition-colors">{adminName}</p>
                            <p className="text-[10px] text-red-600 font-black uppercase tracking-widest">
                                {userRole === 'SUPER_ADMIN' ? 'Quản trị tối cao' : 'Quản trị viên'}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-tr from-red-600 to-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-inner ring-2 ring-red-50">
                            {adminName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* CÁC TRANG CON */}
                <div className="flex-1 p-4 md:p-10 pt-20 md:pt-8 overflow-y-auto w-full">
                    {children}
                </div>
            </main>

        </div>
    );
}