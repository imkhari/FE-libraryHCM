import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function NewsPage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, TIN_TUC, HOC_TAP_BAC

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchArticles(activeTab);
  }, [activeTab]);

  const fetchArticles = async (category) => {
    setLoading(true);
    try {
      // Gọi API lấy bài viết, truyền category nếu cần
      const res = await api.get(`/articles${category !== 'ALL' ? `?category=${category}` : ''}`);
      setArticles(res.data);
    } catch (error) {
      console.error("Lỗi khi tải tin tức:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm "móc" ảnh đầu tiên trong bài viết HTML ra làm ảnh bìa
  const extractFirstImage = (htmlContent) => {
    const match = htmlContent.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : "https://upload.wikimedia.org/wikipedia/commons/e/e0/Ho_Chi_Minh_1946.jpg"; // Ảnh mặc định nếu bài không có ảnh
  };

  // Hàm lọc bỏ thẻ HTML để lấy chữ làm mô tả ngắn
  const extractTextSnippet = (htmlContent) => {
    const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
    return doc.body.textContent.substring(0, 150) + '...';
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-[#fcf9f2] py-8 px-4 font-sans selection:bg-red-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-['Lora',serif] font-black text-red-800 uppercase text-center mb-8">
          Tin tức - Sự kiện
        </h1>

        {/* NÚT ĐIỀU HƯỚNG TAB */}
        <div className="flex justify-center mb-10 gap-4 flex-wrap">
          <button 
            onClick={() => setActiveTab('ALL')}
            className={`px-6 py-2.5 rounded-full font-bold font-['Lora',serif] text-sm md:text-base border-2 transition-all ${activeTab === 'ALL' ? 'bg-red-700 text-white border-red-700 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'}`}
          >
            Tất cả bài viết
          </button>
          <button 
            onClick={() => setActiveTab('TIN_TUC')}
            className={`px-6 py-2.5 rounded-full font-bold font-['Lora',serif] text-sm md:text-base border-2 transition-all ${activeTab === 'TIN_TUC' ? 'bg-red-700 text-white border-red-700 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'}`}
          >
            📢 Hoạt động Nhà trường
          </button>
          <button 
            onClick={() => setActiveTab('HOC_TAP_BAC')}
            className={`px-6 py-2.5 rounded-full font-bold font-['Lora',serif] text-sm md:text-base border-2 transition-all ${activeTab === 'HOC_TAP_BAC' ? 'bg-red-700 text-white border-red-700 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'}`}
          >
            🌟 Học tập & Làm theo Bác
          </button>
        </div>

        {/* DANH SÁCH BÀI VIẾT */}
        {loading ? (
          <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700"></div></div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <div 
                key={article.id} 
                onClick={() => navigate(`/article/${article.id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden flex flex-col"
              >
                {/* Ảnh bìa */}
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
                    {article.category === 'TIN_TUC' ? 'TIN TỨC' : 'HỌC TẬP BÁC'}
                  </div>
                  <img 
                    src={extractFirstImage(article.content)} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Nội dung */}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-lg font-bold font-['Lora',serif] text-gray-800 leading-snug mb-2 line-clamp-2 hover:text-red-700">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 font-['Lora',serif]">
                    {extractTextSnippet(article.content)}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-500 font-medium">
                    <span>Đăng bởi: {article.author?.fullName || "Admin"}</span>
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 italic text-lg">Chưa có bài viết nào trong chuyên mục này.</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default NewsPage;