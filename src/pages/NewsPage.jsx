import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

function NewsPage() {
    const navigate = useNavigate();
    const [allArticles, setAllArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 6; // Hiển thị 6 bài mỗi trang (2 hàng x 3 cột chuẩn mực)

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        loadArticles();
    }, []);

    const loadArticles = async () => {
        setLoading(true);
        try {
            const res = await api.get('/articles');
            const data = (res.data || []).map(article => ({
                id: article.id,
                title: article.title,
                category: article.category,
                authorName: article.authorName || "Ban Biên Tập",
                createdAt: article.createdAt,
                thumbnail: article.thumbnailUrl || "/anh-bac-Ho.jpg",
                snippet: article.snippet || "Thông tin hoạt động và bài viết chuyên đề mới nhất từ nhà trường..."
            }));
            // Đảm bảo bài viết luôn hiển thị theo thời gian mới nhất (mới nhất lên đầu)
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt) || b.id - a.id);
            setAllArticles(data);
        } catch (error) {
            console.error("Lỗi tải danh sách bài viết từ máy chủ:", error);
            setAllArticles([]);
        } finally {
            setLoading(false);
        }
    };

    // Tính toán số lượng bài viết cho từng mục
    const counts = useMemo(() => {
        const tinTucCount = allArticles.filter(a => a.category === 'TIN_TUC').length;
        const hocTapCount = allArticles.filter(a => a.category === 'HOC_TAP_BAC').length;
        return {
            ALL: allArticles.length,
            TIN_TUC: tinTucCount,
            HOC_TAP_BAC: hocTapCount
        };
    }, [allArticles]);

    // Lọc theo Tab chuyên mục và Từ khóa tìm kiếm
    const filteredArticles = useMemo(() => {
        return allArticles.filter(article => {
            const matchesTab = activeTab === 'ALL' || article.category === activeTab;
            const q = searchTerm.trim().toLowerCase();
            const matchesSearch = !q ||
                (article.title && article.title.toLowerCase().includes(q)) ||
                (article.snippet && article.snippet.toLowerCase().includes(q));
            return matchesTab && matchesSearch;
        });
    }, [allArticles, activeTab, searchTerm]);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            const safeDate = dateString.endsWith('Z') || dateString.includes('+') ? dateString : `${dateString}Z`;
            const d = new Date(safeDate);
            return `${d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
        } catch {
            return dateString;
        }
    };

    const formatAuthor = (name) => {
        if (!name) return "Ban Biên tập";
        if (name.includes("Ban Biên Tập") || name.includes("Ban Quản Trị")) return "Ban Biên tập";
        return name;
    };

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 220, behavior: 'smooth' });
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-[#fcf9f2] py-8 px-4 font-['Lora',serif] selection:bg-red-200">
            <div className="max-w-7xl mx-auto">

                {/* TIÊU ĐỀ TRANG TRANG TRỌNG */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center justify-center mb-8 pt-2"
                >
                    <h1 className="text-3xl md:text-4xl font-black text-center text-red-800 uppercase tracking-tight">
                        Tin tức - Sự kiện
                    </h1>

                    <div className="h-1 w-24 bg-red-600 mt-3.5 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.4)]"></div>

                    <p className="mt-3 text-xs md:text-sm text-stone-600 font-sans text-center max-w-xl leading-relaxed">
                        Hoạt động giáo dục truyền thống, phong trào học tập và làm theo tư tưởng, đạo đức, phong cách Hồ Chí Minh
                    </p>
                </motion.div>

                {/* THANH TÌM KIẾM NHANH */}
                <div className="max-w-md mx-auto mb-6 relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        placeholder="Tìm kiếm bài viết, tư liệu..."
                        className="w-full pl-10 pr-9 py-2.5 bg-white border border-stone-300/80 rounded-full text-xs sm:text-sm font-sans text-stone-800 placeholder-stone-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100 transition-all shadow-xs"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3.5 top-2.5 text-stone-400 hover:text-stone-600 text-sm font-bold cursor-pointer"
                            title="Xóa tìm kiếm"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* BỘ LỌC CHUYÊN MỤC (TABS) */}
                <div className="flex justify-center mb-9 gap-2 sm:gap-3 flex-wrap font-sans">
                    <button
                        onClick={() => handleTabChange('ALL')}
                        className={`px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm border transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'ALL'
                            ? 'bg-red-700 text-white border-red-700 shadow-md'
                            : 'bg-white text-stone-700 border-stone-300/90 hover:border-red-400 hover:text-red-700 hover:bg-stone-50'
                            }`}
                    >
                        <span>Tất cả bài viết</span>
                        <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${activeTab === 'ALL' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                            }`}>
                            {counts.ALL}
                        </span>
                    </button>

                    <button
                        onClick={() => handleTabChange('TIN_TUC')}
                        className={`px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm border transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'TIN_TUC'
                            ? 'bg-red-700 text-white border-red-700 shadow-md'
                            : 'bg-white text-stone-700 border-stone-300/90 hover:border-red-400 hover:text-red-700 hover:bg-stone-50'
                            }`}
                    >
                        <span>Tin tức</span>
                        <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${activeTab === 'TIN_TUC' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                            }`}>
                            {counts.TIN_TUC}
                        </span>
                    </button>

                    <button
                        onClick={() => handleTabChange('HOC_TAP_BAC')}
                        className={`px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm border transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'HOC_TAP_BAC'
                            ? 'bg-red-700 text-white border-red-700 shadow-md'
                            : 'bg-white text-stone-700 border-stone-300/90 hover:border-red-400 hover:text-red-700 hover:bg-stone-50'
                            }`}
                    >
                        <span>Học tập & Làm theo Bác</span>
                        <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${activeTab === 'HOC_TAP_BAC' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                            }`}>
                            {counts.HOC_TAP_BAC}
                        </span>
                    </button>
                </div>

                {/* DANH SÁCH BÀI VIẾT HOẶC SKELETON */}
                {loading && allArticles.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div key={item} className="bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col h-[410px]">
                                <div className="h-52 bg-stone-200 w-full"></div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-stone-100 rounded w-full"></div>
                                        <div className="h-3 bg-stone-100 rounded w-5/6"></div>
                                    </div>
                                    <div className="h-3 bg-stone-100 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : currentArticles.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 items-stretch">
                            {currentArticles.map((article) => (
                                <motion.div
                                    key={article.id}
                                    whileHover={{ y: -6 }}
                                    transition={{ duration: 0.25 }}
                                    onClick={() => navigate(`/article/${article.id}`)}
                                    className="bg-white rounded-2xl shadow-xs hover:shadow-xl hover:border-red-600/40 transition-all duration-300 cursor-pointer border border-stone-200/80 overflow-hidden flex flex-col group h-full"
                                >
                                    {/* Khung hình bài viết 16:10 */}
                                    <div className="h-48 sm:h-52 overflow-hidden relative bg-stone-900 border-b border-stone-100 shrink-0">
                                        {/* Tag Chuyên mục */}
                                        <div className="absolute top-3 left-3 z-10">
                                            {article.category === 'TIN_TUC' ? (
                                                <span className="bg-red-700/90 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1.5 tracking-wider uppercase">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                                                    Tin tức
                                                </span>
                                            ) : (
                                                <span className="bg-amber-700/90 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1.5 tracking-wider uppercase">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-300"></span>
                                                    Học tập
                                                </span>
                                            )}
                                        </div>

                                        <img
                                            src={article.thumbnail}
                                            alt={article.title}
                                            loading="lazy"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src = "/anh-bac-Ho.jpg";
                                            }}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                                        />
                                    </div>

                                    {/* Nội dung bài viết */}
                                    <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-3.5">
                                        <div>
                                            <h2 className="text-[15px] sm:text-[16px] font-bold text-stone-900 leading-snug line-clamp-2 min-h-[44px] sm:min-h-[46px] group-hover:text-red-700 transition-colors mb-2">
                                                {article.title}
                                            </h2>
                                            <p className="text-xs sm:text-[13px] text-stone-600 line-clamp-3 min-h-[54px] sm:min-h-[58px] font-sans leading-relaxed">
                                                {article.snippet}
                                            </p>
                                        </div>

                                        {/* Chân thẻ bài viết: Tác giả & Ngày đăng thanh lịch */}
                                        <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-sans">
                                            <div className="flex items-center gap-1.5 text-stone-600 font-medium">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-red-600 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                                <span title={article.authorName}>
                                                    {formatAuthor(article.authorName)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1 text-stone-400 font-mono text-[11px]">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{formatDate(article.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* PHÂN TRANG (PAGINATION) */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-12 gap-1.5 font-sans">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${currentPage === 1
                                        ? 'text-stone-300 border-stone-200 cursor-not-allowed bg-stone-50'
                                        : 'text-red-700 border-stone-300 hover:bg-red-50 hover:border-red-300 cursor-pointer'
                                        }`}
                                >
                                    ← Trước
                                </button>

                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => paginate(index + 1)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border flex items-center justify-center cursor-pointer ${currentPage === index + 1
                                            ? 'bg-red-700 text-white border-red-700 shadow-xs'
                                            : 'bg-white text-stone-700 border-stone-200 hover:bg-red-50 hover:text-red-700'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${currentPage === totalPages
                                        ? 'text-stone-300 border-stone-200 cursor-not-allowed bg-stone-50'
                                        : 'text-red-700 border-stone-300 hover:bg-red-50 hover:border-red-300 cursor-pointer'
                                        }`}
                                >
                                    Sau →
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 shadow-xs max-w-lg mx-auto p-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-stone-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        <p className="text-stone-700 font-bold text-base mb-1">
                            {searchTerm ? 'Không tìm thấy bài viết phù hợp' : 'Chưa có bài viết trong chuyên mục này'}
                        </p>
                        <p className="text-xs text-stone-400 mb-4">
                            {searchTerm
                                ? `Không có kết quả nào cho từ khóa "${searchTerm}". Vui lòng thử từ khóa khác.`
                                : 'Các tin tức hoạt động mới đang được biên tập và sẽ sớm cập nhật.'}
                        </p>
                        {searchTerm ? (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-900 text-white transition-colors cursor-pointer"
                            >
                                Xóa từ khóa tìm kiếm
                            </button>
                        ) : (
                            <button
                                onClick={() => handleTabChange('ALL')}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-700 hover:bg-red-800 text-white transition-colors cursor-pointer"
                            >
                                Xem tất cả bài viết
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default NewsPage;