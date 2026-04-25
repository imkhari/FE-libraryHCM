import React, { useState, useEffect, useMemo } from 'react';
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

    const fetchData = async () => {
      try {
        const detailRes = await api.get(`/articles/${id}`);
        setArticle(detailRes.data);

        const cachedArticles = sessionStorage.getItem('newsCache_ALL');
        let listData = [];
        
        if (cachedArticles) {
          listData = JSON.parse(cachedArticles);
        } else {
          const listRes = await api.get('/articles');
          
          listData = listRes.data.map(item => {
             let thumbnail = "https://upload.wikimedia.org/wikipedia/commons/e/e0/Ho_Chi_Minh_1946.jpg";
             if (item.content) {
                const match = item.content.match(/<img[^>]+src="([^">]+)"/);
                if (match) thumbnail = match[1];
             }
             return {
               id: item.id,
               title: item.title,
               createdAt: item.createdAt,
               thumbnail: thumbnail
             };
          });

          try {
             sessionStorage.setItem('newsCache_ALL', JSON.stringify(listData));
          } catch (e) {
             console.warn("Bộ nhớ đệm đầy, bỏ qua lưu cache.");
          }
        }

        const otherArticles = listData
          .filter(item => item.id.toString() !== id.toString())
          .slice(0, 5);
        setRecentArticles(otherArticles);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getThumbnail = (htmlContent) => {
    if (article && article.thumbnail) return article.thumbnail;
    const match = htmlContent?.match(/<img[^>]+src="([^">]+)"/);
    return match ? match[1] : "https://tranhdaquy24h.com/public/upload/images/7ef5cf3972688e36d779.jpg";
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const safeDate = dateString.endsWith('Z') || dateString.includes('+') ? dateString : `${dateString}Z`;
    const d = new Date(safeDate);
    const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const date = d.toLocaleDateString('vi-VN');
    return `${time} | ${date}`;
  };

  const sanitizedContent = useMemo(() => {
    if (!article?.content) return "";

    try {
      let cleanString = article.content
        .replace(/&nbsp;/gi, ' ')
        .replace(/\u00A0/g, ' ');

      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanString, 'text/html');

      const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT, null, false);
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeValue) {
          let text = node.nodeValue;
          text = text.replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '');
          text = text.replace(/ - /g, '\u00A0-\u00A0'); 
          node.nodeValue = text;
        }
      }

      const elements = doc.body.querySelectorAll('*');
      elements.forEach(el => {
        if (el.hasAttribute('style')) {
          el.removeAttribute('style');
        }
        el.classList.remove('ql-align-justify', 'ql-align-center', 'ql-align-right');
      });

      return doc.body.innerHTML;
    } catch (error) {
      console.error(error);
      return article.content;
    }
  }, [article?.content]);

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
            <span>Đăng lúc: <strong className="text-gray-700">{formatDateTime(article.createdAt || article.publishDate)}</strong></span>
            <span className="mx-3">|</span>
            <span>Tác giả: <strong className="text-gray-800">{article.author?.fullName || article.author || "Ban Quản Trị"}</strong></span>
          </div>

          <div className="relative">
            <style dangerouslySetInnerHTML={{__html: `
              .article-clean-content, .article-clean-content * {
                word-break: normal !important;
                overflow-wrap: break-word !important;
                white-space: normal !important;
                -webkit-hyphens: none !important;
                -ms-hyphens: none !important;
                hyphens: none !important;
              }
            `}} />

            <div 
              className="
                article-clean-content
                prose max-w-none 
                prose-headings:font-black prose-headings:text-[#8b1c1c] 
                prose-img:rounded-2xl prose-img:shadow-md prose-img:mx-auto
                [&_*]:text-left 
                [&_p]:leading-[1.9] 
                [&_p]:mb-6
                [&_p]:text-gray-800
                [&_p]:text-[17px]
              "
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
          </div>
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
                        src={item.thumbnail || getThumbnail(item.content)}
                        alt="thumb"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-[14px] font-bold text-gray-800 group-hover:text-red-700 leading-snug line-clamp-2 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-1">{formatDateTime(item.createdAt)}</p>
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