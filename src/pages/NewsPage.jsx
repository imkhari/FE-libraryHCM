import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function NewsPage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchArticles(activeTab);
  }, [activeTab]);

  const fetchArticles = async (category) => {
    setLoading(true);
    try {
      const cacheKey = `newsCache_${category}`;
      const cachedData = sessionStorage.getItem(cacheKey);

      if (cachedData) {
        setArticles(JSON.parse(cachedData));
        setLoading(false);
      }

      const res = await api.get(`/articles${category !== 'ALL' ? `?category=${category}` : ''}`);
      
      // 🌟 ÉP CÂN DỮ LIỆU: Chỉ lấy những thứ cần thiết, NÉM BỎ cột 'content' khổng lồ
      const processedArticles = res.data.map(article => {
        let snippet = '';
        let thumbnail = "https://upload.wikimedia.org/wikipedia/commons/e/e0/Ho_Chi_Minh_1946.jpg";
        
        if (article.content) {
          const match = article.content.match(/<img[^>]+src="([^">]+)"/);
          if (match) thumbnail = match[1];

          const doc = new DOMParser().parseFromString(article.content, 'text/html');
          snippet = doc.body.textContent.substring(0, 150) + '...';
        }

        // Tuyệt đối KHÔNG dùng ...article ở đây nữa
        return {
          id: article.id,
          title: article.title,
          category: article.category,
          author: article.author,
          createdAt: article.createdAt,
          thumbnail: thumbnail,
          snippet: snippet
        };
      });

      // 🌟 Lưu an toàn với try..catch để tránh sập web nếu trình duyệt hết dung lượng
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(processedArticles));
      } catch (e) {
        console.warn("Bộ nhớ đệm đầy, bỏ qua lưu cache.");
      }
      
      setArticles(processedArticles);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const safeDate = dateString.endsWith('Z') || dateString.includes('+') ? dateString : `${dateString}Z`;
    const d = new Date(safeDate);
    
    return `${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} - ${d.toLocaleDateString('vi-VN')}`;
  };

  return (
    <div className="min-h-screen bg-[#fcf9f2] py-8 px-4 font-sans selection:bg-red-200">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-['Lora',serif] font-black text-red-800 uppercase text-center mb-8">
          Tin tức - Sự kiện
        </h1>

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
            Hoạt động Nhà trường
          </button>
          <button 
            onClick={() => setActiveTab('HOC_TAP_BAC')}
            className={`px-6 py-2.5 rounded-full font-bold font-['Lora',serif] text-sm md:text-base border-2 transition-all ${activeTab === 'HOC_TAP_BAC' ? 'bg-red-700 text-white border-red-700 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'}`}
          >
            Học tập & Làm theo Bác
          </button>
        </div>

        {loading && articles.length === 0 ? (
          <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700"></div></div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <div 
                key={article.id} 
                onClick={() => navigate(`/article/${article.id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm z-10">
                    {article.category === 'TIN_TUC' ? 'TIN TỨC' : 'HỌC TẬP BÁC'}
                  </div>
                  <img 
                    src={article.thumbnail} 
                    alt={article.title} 
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-lg font-bold font-['Lora',serif] text-gray-800 leading-snug mb-2 line-clamp-2 hover:text-red-700">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 font-['Lora',serif]">
                    {article.snippet}
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