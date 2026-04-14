import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    // Kéo dữ liệu bài viết chi tiết từ API
    api.get(`/articles/${id}`)
      .then(res => setArticle(res.data))
      .catch(err => {
        console.error("Lỗi API, dùng data giả:", err);
        // Dữ liệu giả định dạng HTML (WYSIWYG)
        setArticle({
          title: "Bác Hồ với dân chủ và bài học về đạo đức cách mạng",
          publishDate: "Thứ hai, 13/04/2026 - 15:07",
          author: "Đình Tuân",
          category: "Nguồn gốc hình thành",
          content: `
            <p><strong>Xuân Bính Ngọ 1946 là một mùa xuân đặc biệt, gắn với nhiều sự kiện, mốc son lịch sử.</strong></p>
            <p>Đó là mùa xuân thứ 80 của Quốc hội và Hiến pháp nước Việt Nam mới. Bằng nhiều mô hình sáng tạo, cách làm thiết thực, Bộ đội Biên phòng tỉnh Cao Bằng đưa việc học tập và làm theo Bác trở thành việc làm thường xuyên...</p>
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Ho_Chi_Minh_1946.jpg" alt="Bác Hồ" style="width: 100%; border-radius: 8px; margin: 20px 0;"/>
            <p>Từ phương châm đó, nhiều mô hình hay, cách làm hiệu quả đã được hình thành và từng bước nhân rộng.</p>
          `
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex justify-center items-center">Đang tải nội dung...</div>;
  if (!article) return <div className="min-h-screen flex justify-center items-center">Không tìm thấy bài viết!</div>;

  return (
    <div className="min-h-screen bg-[#fcf9f2] py-8 px-4 font-sans selection:bg-red-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CỘT TRÁI: NỘI DUNG BÀI BÁO */}
        <div className="lg:col-span-8 bg-white p-6 md:p-10 rounded-xl shadow-sm border border-gray-100">
          
          <button onClick={() => navigate(-1)} className="text-red-700 hover:text-red-900 font-bold mb-6 flex items-center text-sm">
            ← Quay lại danh sách
          </button>

          <div className="text-sm font-bold text-red-700 uppercase mb-2">{article.category}</div>
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-8 pb-4 border-b border-gray-200">
            <span>Đăng lúc: {article.publishDate}</span>
            <span className="mx-3">|</span>
            <span>Tác giả: <strong>{article.author}</strong></span>
          </div>

          {/* RENDER MÃ HTML TỪ BACKEND */}
          <div 
            className="prose prose-lg max-w-none text-gray-800 text-justify leading-relaxed prose-img:rounded-xl prose-img:shadow-md prose-headings:text-red-800 prose-a:text-red-600"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

        </div>

        {/* CỘT PHẢI: SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-red-700 uppercase border-b-2 border-red-700 pb-2 mb-4">Tin tức nổi bật</h3>
            <p className="text-sm text-gray-500 italic">Đang cập nhật...</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ArticleDetail;