import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion'; 

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
      
      // MAP DỮ LIỆU CHUẨN THEO DTO TỪ BACKEND
      const processedArticles = res.data.map(article => {
        return {
          id: article.id,
          title: article.title,
          category: article.category,
          // Sửa lại cách lấy Tác giả chuẩn theo DTO
          authorName: article.authorName || "Quản trị viên",
          createdAt: article.createdAt,
          // 👇 Tạm thời hardcode ảnh và snippet vì Backend DTO chưa trả về 2 trường này
          thumbnail: article.thumbnailUrl || "https://tranhdaquy24h.com/public/upload/images/7ef5cf3972688e36d779.jpg",
          snippet: article.snippet || "Nội dung đang được cập nhật..." 
        };
      });

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f2] py-8 px-4 font-sans selection:bg-red-200">
      <div className="max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center mb-12 pt-4 group cursor-pointer" 
        >
          <h1 className="text-3xl md:text-4xl font-['Lora',serif] font-black text-center text-red-800 uppercase tracking-tight group-hover:text-[#cc0000] transition-colors duration-300">
            Tin tức - Sự kiện
          </h1>
          
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 96 }} // Chạy ra 96px lúc load trang
            whileHover={{ width: 150 }} // Tỏa rộng ra 150px khi rê chuột vào
            transition={{ delay: 0.5, duration: 0.8, type: "spring", stiffness: 120 }}
            className="h-1 bg-red-600 mt-5 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)] origin-center"
          ></motion.div>
        </motion.div>

        {/* NÚT ĐIỀU HƯỚNG TAB */}
        <div className="flex justify-center mb-12 gap-4 flex-wrap">
          <button onClick={() => setActiveTab('ALL')} className={`px-6 py-2.5 rounded-full font-bold font-['Lora',serif] text-sm md:text-base border-2 transition-all ${activeTab === 'ALL' ? 'bg-[#cc0000] text-white border-[#cc0000] shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'}`}>Tất cả bài viết</button>
          <button onClick={() => setActiveTab('TIN_TUC')} className={`px-6 py-2.5 rounded-full font-bold font-['Lora',serif] text-sm md:text-base border-2 transition-all ${activeTab === 'TIN_TUC' ? 'bg-[#cc0000] text-white border-[#cc0000] shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'}`}>Hoạt động Nhà trường</button>
          <button onClick={() => setActiveTab('HOC_TAP_BAC')} className={`px-6 py-2.5 rounded-full font-bold font-['Lora',serif] text-sm md:text-base border-2 transition-all ${activeTab === 'HOC_TAP_BAC' ? 'bg-[#cc0000] text-white border-[#cc0000] shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'}`}>Học tập & Làm theo Bác</button>
        </div>

        {/* DANH SÁCH BÀI VIẾT */}
        {loading && articles.length === 0 ? (
          <div className="flex justify-center items-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700"></div></div>
        ) : articles.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {articles.map(article => (
              <motion.div 
                key={article.id} 
                variants={itemVariants}
                whileHover={{ y: -8 }} 
                onClick={() => navigate(`/article/${article.id}`)}
                className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(204,0,0,0.15)] transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden flex flex-col group"
              >
                <div className="h-52 overflow-hidden relative border-b border-gray-100">
                  <div className="absolute top-3 left-3 bg-[#cc0000] text-white text-[10px] font-bold px-3 py-1.5 rounded shadow-md z-10 uppercase tracking-wider">
                    {article.category === 'TIN_TUC' ? 'Tin tức' : 'Học tập Bác'}
                  </div>
                  <img src={article.thumbnail} alt={article.title} loading="lazy" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"/>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-[17px] font-bold font-['Lora',serif] text-gray-800 leading-[1.4] mb-3 line-clamp-2 group-hover:text-[#cc0000] transition-colors">{article.title}</h2>
                  <p className="text-[14px] text-gray-600 line-clamp-3 mb-5 font-sans leading-relaxed">{article.snippet}</p>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500 font-medium uppercase tracking-wide">
                    <span>Đăng bởi: <strong className="text-gray-700">{article.authorName}</strong></span>
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300 shadow-sm">
            <p className="text-gray-500 italic text-lg font-['Lora',serif]">Chưa có bài viết nào trong chuyên mục này.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsPage;