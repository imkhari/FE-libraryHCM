import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    Promise.all([
      api.get(`/articles/${id}`),
      api.get('/articles')
    ])
      .then(([detailRes, listRes]) => {
        setArticle(detailRes.data);
        const otherArticles = listRes.data
          .filter(item => item.id.toString() !== id.toString())
          .slice(0, 5);
        setRecentArticles(otherArticles);
      })
      .catch(err => {
        console.error("Lỗi khi tải dữ liệu:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const getThumbnail = (htmlContent) => {
    const match = htmlContent?.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : "https://upload.wikimedia.org/wikipedia/commons/e/e0/Ho_Chi_Minh_1946.jpg";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Đã đồng bộ font Lora cho cả màn hình chờ và lỗi
  if (loading) return <div className="min-h-screen flex justify-center items-center text-gray-500 font-['Lora',serif] font-bold">Đang tải nội dung...</div>;
  if (!article) return <div className="min-h-screen flex justify-center items-center text-red-600 font-['Lora',serif] font-bold">Không tìm thấy bài viết!</div>;

  return (
    <div className="min-h-screen bg-[#fcf9f2] py-8 px-4 font-['Lora',serif] selection:bg-red-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100">
          
          <button onClick={() => navigate(-1)} className="text-red-700 hover:text-red-900 font-bold mb-6 flex items-center text-sm transition-colors">
            ← Quay lại danh sách
          </button>

          <div className="text-sm font-bold text-red-700 uppercase mb-2">
            {article.category === 'TIN_TUC' ? 'Tin tức - Sự kiện' : 'Học tập & Làm theo Bác'}
          </div>
          
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-8 pb-4 border-b border-gray-200">
            <span>Đăng lúc: {formatDate(article.createdAt || article.publishDate)}</span>
            <span className="mx-3">|</span>
            <span>Tác giả: <strong className="text-gray-800">{article.author?.fullName || article.author || "Ban Quản Trị"}</strong></span>
          </div>

          <div 
            className="prose prose-lg max-w-none text-gray-800 text-justify leading-relaxed prose-img:rounded-xl prose-img:shadow-md prose-headings:text-red-800"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
        

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-red-800 uppercase border-b-2 border-red-700 pb-2 mb-6">Bài viết mới nhất</h3>
            
            <div className="flex flex-col gap-6">
              {recentArticles.length > 0 ? (
                recentArticles.map(item => (
                  <Link key={item.id} to={`/article/${item.id}`} className="flex gap-4 group cursor-pointer">
                    <div className="w-20 h-20 shrink-0 rounded overflow-hidden bg-gray-100 border border-gray-50 shadow-sm">
                      <img 
                        src={getThumbnail(item.content)} 
                        alt="thumb" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-[14px] font-bold text-gray-800 group-hover:text-red-700 leading-snug line-clamp-2 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-1">{formatDate(item.createdAt)}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">Không có bài viết liên quan khác.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ArticleDetail;