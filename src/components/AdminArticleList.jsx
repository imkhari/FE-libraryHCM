import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminArticleList() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            const res = await api.get('/articles');
            setArticles(res.data);
        } catch (error) {
            console.error("Lỗi lấy bài viết:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return { time: "", date: "" };
        const safeDate = dateString.endsWith('Z') || dateString.includes('+') ? dateString : `${dateString}Z`;
        const d = new Date(safeDate);
        return {
            time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            date: d.toLocaleDateString('vi-VN')
        };
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleDelete = async (id, title) => {
        if (window.confirm(`Thầy/Cô có chắc chắn muốn xóa bài viết: "${title}" không? Hành động này không thể hoàn tác.`)) {
            try {
                await api.delete(`/articles/${id}`);
                fetchArticles();
                alert("Đã xóa bài viết thành công!");
            } catch (error) {
                alert("Lỗi khi xóa bài viết. Có thể bạn không có quyền hoặc lỗi server.");
                console.error(error);
            }
        }
    };

    return (
        <div className="w-full max-w-full animate-fade-in font-sans">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Quản lý bài viết</h1>
                    <p className="text-sm text-slate-500 mt-1">Xem, sửa và xóa các nội dung đã đăng.</p>
                </div>
                <Link to="/admin/create-post" className="w-full sm:w-auto justify-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                    <span className="text-lg leading-none">+</span> Thêm bài mới
                </Link>
            </div>

            {/* Bảng Dữ liệu Responsive */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-10 text-center text-slate-400 font-bold tracking-widest text-sm uppercase animate-pulse">Đang tải dữ liệu...</div>
                ) : articles.length === 0 ? (
                    <div className="p-10 text-center text-slate-500 italic">Chưa có bài viết nào trong hệ thống.</div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase font-black tracking-wider">
                                    <th className="p-4 pl-6">ID</th>
                                    <th className="p-4 w-1/2">Tiêu đề</th>
                                    <th className="p-4">Chuyên mục</th>
                                    <th className="p-4">Ngày đăng</th>
                                    <th className="p-4 text-center pr-6">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {articles.map((article) => (
                                    <tr key={article.id} className="hover:bg-slate-50/80 transition-colors text-sm">
                                        <td className="p-4 pl-6 text-slate-400 font-medium">#{article.id}</td>
                                        <td className="p-4 font-bold text-slate-800 leading-snug">
                                           <span className="line-clamp-2">{article.title}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${article.category === 'TIN_TUC' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-purple-50 text-purple-600 border border-purple-100'}`}>
                                                {article.category === 'TIN_TUC' ? 'Tin Tức' : 'Học Tập Bác'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                                            <div className="font-bold text-slate-700">
                                                {formatDateTime(article.createdAt).time}
                                            </div>
                                            <div className="mt-0.5">
                                                {formatDateTime(article.createdAt).date}
                                            </div>
                                        </td>
                                        <td className="p-4 pr-6 flex items-center justify-center gap-2">
                                            <Link to={`/admin/edit-post/${article.id}`} className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                                                Sửa
                                            </Link>
                                            <button onClick={() => handleDelete(article.id, article.title)} className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}