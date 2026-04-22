import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. READ: Lấy danh sách bài viết
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

  useEffect(() => {
    fetchArticles();
  }, []);

  // 2. DELETE: Xóa bài viết
  const handleDelete = async (id, title) => {
    if (window.confirm(`Thầy/Cô có chắc chắn muốn xóa bài viết: "${title}" không? Hành động này không thể hoàn tác.`)) {
      try {
        await api.delete(`/articles/${id}`);
        // Xóa xong thì gọi lại hàm lấy danh sách để cập nhật giao diện
        fetchArticles();
        alert("Đã xóa bài viết thành công!");
      } catch (error) {
        alert("Lỗi khi xóa bài viết. Có thể bạn không có quyền hoặc lỗi server.");
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-800">Quản lý bài viết</h1>
          <p className="text-gray-500 mt-1">Xem, sửa và xóa các nội dung đã đăng.</p>
        </div>
        <Link to="/admin/create-post" className="bg-red-700 hover:bg-red-800 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
          <span>+</span> Thêm bài mới
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500 font-bold">Đang tải dữ liệu...</div>
        ) : articles.length === 0 ? (
          <div className="p-10 text-center text-gray-500 italic">Chưa có bài viết nào trong hệ thống.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                  <th className="p-4 font-bold">ID</th>
                  <th className="p-4 font-bold w-1/2">Tiêu đề</th>
                  <th className="p-4 font-bold">Chuyên mục</th>
                  <th className="p-4 font-bold">Ngày đăng</th>
                  <th className="p-4 font-bold text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-gray-50 hover:bg-red-50/30 transition-colors">
                    <td className="p-4 text-gray-500 font-medium">#{article.id}</td>
                    <td className="p-4 font-bold text-gray-800 line-clamp-2 leading-snug">{article.title}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${article.category === 'TIN_TUC' ? 'bg-blue-100 text-blue-700' : 'bg-fuchsia-100 text-fuchsia-700'}`}>
                        {article.category === 'TIN_TUC' ? 'Tin Tức' : 'Học Tập Bác'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4 flex items-center justify-center gap-3">
                      {/* Nút Sửa (UPDATE) */}
                      <Link to={`/admin/edit-post/${article.id}`} className="text-blue-600 hover:text-blue-900 font-semibold bg-blue-50 px-3 py-1 rounded">
                        Sửa
                      </Link>
                      {/* Nút Xóa (DELETE) */}
                      <button onClick={() => handleDelete(article.id, article.title)} className="text-red-600 hover:text-red-900 font-semibold bg-red-50 px-3 py-1 rounded">
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