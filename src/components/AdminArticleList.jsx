import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiSearch, 
  HiX, 
  HiPlus, 
  HiEye, 
  HiPencilAlt, 
  HiTrash, 
  HiCalendar, 
  HiChevronLeft, 
  HiChevronRight,
  HiExclamation,
  HiSortDescending,
  HiEyeOff
} from 'react-icons/hi';

export default function AdminArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc, tìm kiếm và sắp xếp
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST'); // NEWEST | OLDEST | MOST_VIEWED
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal xác nhận xóa
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/articles');
      setArticles(res.data || []);
    } catch (error) {
      console.error("Lỗi lấy bài viết:", error);
      toast.error("Không thể tải danh sách bài viết!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const formatDateTime = (dateString) => {
    if (!dateString) return { time: "", date: "" };
    try {
      const safeDate = dateString.endsWith('Z') || dateString.includes('+') ? dateString : `${dateString}Z`;
      const d = new Date(safeDate);
      return {
        time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
      };
    } catch {
      return { time: "", date: dateString };
    }
  };

  // Xác nhận và xóa bài viết với Optimistic UI (cập nhật giao diện tức thì)
  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    const deletedId = articleToDelete.id;
    const previousArticles = [...articles];

    // Cập nhật giao diện trong 1ms
    setArticles(prev => prev.filter(a => a.id !== deletedId));
    setIsDeleting(true);

    try {
      await api.delete(`/articles/${deletedId}`);
      toast.success(`Đã xóa bài viết "${articleToDelete.title.substring(0, 35)}..." thành công!`);
      setArticleToDelete(null);
    } catch (error) {
      // Rollback nếu có lỗi
      setArticles(previousArticles);
      toast.error("Không thể xóa bài viết. Vui lòng kiểm tra lại quyền hạn hoặc máy chủ!");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Đếm số lượng theo chuyên mục & tổng lượt xem
  const counts = useMemo(() => {
    const tinTuc = articles.filter(a => a.category === 'TIN_TUC').length;
    const hocTap = articles.filter(a => a.category === 'HOC_TAP_BAC').length;
    const totalViews = articles.reduce((sum, a) => sum + (Number(a.views) || 0), 0);
    return {
      ALL: articles.length,
      TIN_TUC: tinTuc,
      HOC_TAP_BAC: hocTap,
      TOTAL_VIEWS: totalViews
    };
  }, [articles]);

  // Danh sách đã lọc theo Tab, Search và Sắp xếp
  const filteredAndSortedArticles = useMemo(() => {
    const result = articles.filter(item => {
      const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch = !q || 
        (item.title && item.title.toLowerCase().includes(q)) || 
        (item.authorName && item.authorName.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });

    if (sortBy === 'NEWEST') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt) || b.id - a.id);
    } else if (sortBy === 'OLDEST') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt) || a.id - b.id);
    } else if (sortBy === 'MOST_VIEWED') {
      result.sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0) || b.id - a.id);
    }

    return result;
  }, [articles, selectedCategory, searchTerm, sortBy]);

  // Phân trang
  const totalPages = Math.ceil(filteredAndSortedArticles.length / itemsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedArticles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedArticles, currentPage, itemsPerPage]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className="w-full max-w-full font-['Lora',serif] animate-fade-in pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
            Quản Lý Bài Viết
          </h1>
          <p className="text-xs md:text-sm text-stone-500 font-sans mt-1">
            Tổng số <strong className="text-red-700">{articles.length}</strong> bài viết • Tổng cộng <strong className="text-stone-800">{counts.TOTAL_VIEWS.toLocaleString('vi-VN')}</strong> lượt đọc trên toàn bộ không gian.
          </p>
        </div>

        <Link 
          to="/admin/create-post" 
          className="w-full sm:w-auto justify-center bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded-xl font-sans font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          <HiPlus className="w-4 h-4" /> 
          <span>Soạn bài mới</span>
        </Link>
      </div>

      {/* THANH CÔNG CỤ: TÌM KIẾM, BỘ LỌC CHUYÊN MỤC & SẮP XẾP */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/80 shadow-xs mb-6 font-sans space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4 flex-wrap">
        
        {/* Bộ lọc chuyên mục */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleCategoryChange('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'ALL'
                ? 'bg-red-700 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>Tất cả</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'ALL' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
            }`}>
              {counts.ALL}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('TIN_TUC')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'TIN_TUC'
                ? 'bg-red-700 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>Tin Tức</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'TIN_TUC' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
            }`}>
              {counts.TIN_TUC}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleCategoryChange('HOC_TAP_BAC')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'HOC_TAP_BAC'
                ? 'bg-red-700 text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>Học Tập Bác</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedCategory === 'HOC_TAP_BAC' ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-600'
            }`}>
              {counts.HOC_TAP_BAC}
            </span>
          </button>
        </div>

        {/* Thanh tìm kiếm & Sắp xếp */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Sắp xếp */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 pl-3 pr-8 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 font-semibold focus:outline-none focus:border-red-400 cursor-pointer"
            >
              <option value="NEWEST">Mới nhất trước</option>
              <option value="OLDEST">Cũ nhất trước</option>
              <option value="MOST_VIEWED">Xem nhiều nhất</option>
            </select>
          </div>

          {/* Ô Tìm kiếm */}
          <div className="relative flex-1 sm:w-64">
            <HiSearch className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Tìm theo tiêu đề..."
              className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer p-0.5"
              >
                <HiX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* BẢNG DỮ LIỆU BÀI VIẾT */}
      <div className="bg-white rounded-3xl shadow-xs border border-stone-200/80 overflow-hidden font-sans">
        {loading ? (
          <div className="py-16 text-center text-stone-400 font-semibold text-xs tracking-wider animate-pulse flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải danh sách bài viết...</span>
          </div>
        ) : filteredAndSortedArticles.length === 0 ? (
          <div className="py-16 px-4 text-center text-stone-400 font-sans text-xs">
            {searchTerm ? (
              <div>
                <p className="font-bold text-stone-600 text-sm mb-1">Không tìm thấy bài viết phù hợp</p>
                <p>Không có bài viết nào khớp với từ khóa "{searchTerm}".</p>
              </div>
            ) : (
              <div>Chưa có bài viết nào trong chuyên mục này.</div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 text-[11px] uppercase font-bold tracking-wider">
                  <th className="py-3.5 px-4 pl-6 w-16 text-center">ID</th>
                  <th className="py-3.5 px-4 w-20">Ảnh</th>
                  <th className="py-3.5 px-4 min-w-[280px]">Tiêu đề bài viết</th>
                  <th className="py-3.5 px-4 w-36">Chuyên mục</th>
                  <th className="py-3.5 px-4 w-28 text-center">Lượt đọc</th>
                  <th className="py-3.5 px-4 w-36">Thời gian đăng</th>
                  <th className="py-3.5 px-4 pr-6 text-center w-36">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {paginatedArticles.map((article) => {
                  const dateTime = formatDateTime(article.createdAt);
                  const viewsCount = Number(article.views) || 0;

                  return (
                    <tr key={article.id} className="hover:bg-stone-50/70 transition-colors">
                      
                      {/* Cột ID */}
                      <td className="py-3.5 px-4 pl-6 text-stone-400 font-mono text-center">
                        #{article.id}
                      </td>

                      {/* Cột Ảnh thumbnail thu nhỏ */}
                      <td className="py-3.5 px-4">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-stone-100 border border-stone-200/80 shrink-0">
                          <img
                            src={article.thumbnailUrl || "/anh-bac-Ho.jpg"}
                            alt={article.title}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/anh-bac-Ho.jpg";
                            }}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Cột Tiêu đề */}
                      <td className="py-3.5 px-4 font-bold text-stone-800 leading-snug font-['Lora',serif]">
                        <span className="line-clamp-2 hover:text-red-700 transition-colors">
                          {article.title}
                        </span>
                      </td>

                      {/* Cột Chuyên mục */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {article.category === 'TIN_TUC' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-red-700 bg-red-50 border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                            Tin tức
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                            Học tập Bác
                          </span>
                        )}
                      </td>

                      {/* Cột Lượt đọc (Views) */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-600 font-sans">
                          <HiEye className="w-3.5 h-3.5 text-stone-400" />
                          <span>{viewsCount.toLocaleString('vi-VN')}</span>
                        </span>
                      </td>

                      {/* Cột Thời gian */}
                      <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                        <div className="font-semibold text-stone-700 flex items-center gap-1 text-[11px]">
                          <HiCalendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{dateTime.date}</span>
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                          {dateTime.time}
                        </div>
                      </td>

                      {/* Cột Thao tác (3 nút) */}
                      <td className="py-3.5 px-4 pr-6">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Nút 1: Xem ngoài web */}
                          <a
                            href={`/article/${article.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Xem bài viết trực tiếp ngoài trang chủ"
                            className="p-2 bg-stone-50 hover:bg-stone-100 text-stone-600 hover:text-red-700 rounded-lg border border-stone-200 transition-colors cursor-pointer"
                          >
                            <HiEye className="w-3.5 h-3.5" />
                          </a>

                          {/* Nút 2: Sửa */}
                          <Link
                            to={`/admin/edit-post/${article.id}`}
                            title="Chỉnh sửa bài viết"
                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors"
                          >
                            <HiPencilAlt className="w-3.5 h-3.5" />
                          </Link>

                          {/* Nút 3: Xóa */}
                          <button
                            type="button"
                            onClick={() => setArticleToDelete(article)}
                            title="Xóa bài viết"
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 transition-colors cursor-pointer"
                          >
                            <HiTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PHÂN TRANG */}
        {filteredAndSortedArticles.length > itemsPerPage && (
          <div className="py-3.5 px-6 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between flex-wrap gap-3 text-xs text-stone-500 font-sans">
            <div>
              Hiển thị <strong className="text-stone-800">{(currentPage - 1) * itemsPerPage + 1}</strong> - <strong className="text-stone-800">{Math.min(currentPage * itemsPerPage, filteredAndSortedArticles.length)}</strong> trên tổng số <strong className="text-stone-800">{filteredAndSortedArticles.length}</strong> bài viết
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Trang trước"
              >
                <HiChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 font-semibold text-stone-700">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-1.5 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Trang tiếp"
              >
                <HiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL XÁC NHẬN XÓA BÀI VIẾT CAO CẤP */}
      <AnimatePresence>
        {articleToDelete && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200"
            >
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4 border border-red-100">
                <HiExclamation className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-stone-900 text-base mb-2 font-['Lora',serif]">
                Xác nhận xóa bài viết
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed mb-3">
                Thầy/Cô có chắc chắn muốn xóa vĩnh viễn bài viết này không? Hành động này không thể hoàn tác.
              </p>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl mb-6">
                <p className="font-bold text-stone-800 text-xs font-['Lora',serif] line-clamp-2">
                  "{articleToDelete.title}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setArticleToDelete(null)}
                  className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isDeleting ? 'Đang xóa...' : 'Xóa bài viết'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}