import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import 'react-quill-new/dist/quill.snow.css';
import { FaFacebookF, FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho Form Bình Luận
  const [commentEmail, setCommentEmail] = useState('');
  const [commentContent, setCommentContent] = useState('');

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

      return doc.body.innerHTML;
    } catch (error) {
      console.error(error);
      return article.content;
    }
  }, [article?.content]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const handleShareFacebook = () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank', 'width=600,height=400');
  };
  const handleShareZalo = () => {
      window.open(`https://zalo.me/share?url=${encodeURIComponent(currentUrl)}`, '_blank', 'width=600,height=400');
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fcf9f2] py-8 px-4 font-['Lora',serif]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-transparent animate-pulse">
            <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <div className="h-4 bg-slate-200 rounded w-32 mb-6"></div>
                <div className="h-10 bg-slate-200 rounded w-full mb-3"></div>
                <div className="h-10 bg-slate-200 rounded w-2/3 mb-8"></div>
                <div className="h-4 bg-slate-200 rounded w-64 mb-8 pb-4 border-b border-gray-100"></div>

                <div className="h-64 sm:h-96 bg-slate-200 rounded-2xl w-full mb-8"></div>
                <div className="space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
            </div>
            
            {/* Skeleton Nút Chia sẻ (Tròn) */}
            <div className="flex justify-end gap-3 mb-6">
                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
            </div>

            {/* Skeleton Khung Bình Luận (Gọn gàng) */}
            <div className="bg-white/40 p-6 rounded-2xl border border-white shadow-sm">
                <div className="h-6 bg-slate-200 rounded-lg w-32 mb-5"></div>
                <div className="space-y-4">
                    <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
                    <div className="h-20 bg-slate-200 rounded-xl w-full"></div>
                </div>
            </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="h-6 bg-slate-200 rounded w-1/2 mb-6"></div>
            <div className="flex flex-col gap-6 animate-pulse">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl bg-slate-200 shrink-0"></div>
                  <div className="flex-1 py-1 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!article) return <div className="min-h-screen flex justify-center items-center text-red-600 font-['Lora',serif] font-bold">Không tìm thấy bài viết!</div>;

  return (
    <div className="min-h-screen bg-[#fcf9f2] py-8 px-4 font-['Lora',serif] selection:bg-red-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        <div className="lg:col-span-8">
            <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 mb-6 relative z-10">

                <button onClick={() => navigate(-1)} className="text-red-700 hover:text-red-900 font-bold mb-8 flex items-center text-sm transition-colors hover:-translate-x-1 duration-300">
                    ← Quay lại danh sách
                </button>

                <div className="text-[13px] font-black text-red-700 uppercase tracking-widest mb-3">
                    {article.category === 'TIN_TUC' ? 'Tin tức - Sự kiện' : 'Học tập & Làm theo Bác'}
                </div>

                <h1 className="text-3xl md:text-[40px] font-black text-gray-900 mb-6 leading-[1.2] tracking-tight">
                    {article.title}
                </h1>

                <div className="flex items-center text-sm text-gray-500 mb-10 pb-6 border-b border-gray-100">
                    <span>Đăng lúc: <strong className="text-gray-700">{formatDateTime(article.createdAt || article.publishDate)}</strong></span>
                    <span className="mx-4 text-gray-300">|</span>
                    <span>Tác giả: <strong className="text-gray-800">{article.author?.fullName || article.author || "Ban Quản Trị"}</strong></span>
                </div>

                <div className="relative">
                    <style dangerouslySetInnerHTML={{
                    __html: `
                    .article-content-wrapper img {
                        max-width: 100% !important;
                        max-height: 450px !important;
                        width: auto !important;
                        height: auto !important;
                        object-fit: contain !important;
                        margin: 2.5rem auto !important;
                        display: block !important;
                        border-radius: 12px !important;
                        box-shadow: 0 4px 15px -3px rgb(0 0 0 / 0.1) !important;
                    }

                    .article-content-wrapper .ql-align-center,
                    .article-content-wrapper [style*="text-align: center"],
                    .article-content-wrapper [style*="text-align:center"] {
                        text-align: center !important;
                        display: block !important;
                        width: 100% !important;
                    }

                    .article-content-wrapper .ql-align-right,
                    .article-content-wrapper [style*="text-align: right"],
                    .article-content-wrapper [style*="text-align:right"] {
                        text-align: right !important;
                        display: block !important;
                        width: 100% !important;
                    }

                    .article-content-wrapper .ql-align-justify,
                    .article-content-wrapper [style*="text-align: justify"],
                    .article-content-wrapper [style*="text-align:justify"] {
                        text-align: justify !important;
                        display: block !important;
                    }

                    .article-content-wrapper iframe {
                        width: 100% !important;
                        aspect-ratio: 16 / 9 !important;
                        border-radius: 12px !important;
                        margin: 2.5rem auto !important;
                    }
                    `}} />

                    <div
                    className="
                        article-content-wrapper 
                        ql-snow 
                        prose max-w-none 
                        prose-headings:font-black prose-headings:text-gray-900 
                        prose-h6:text-[15px] prose-h6:font-normal prose-h6:text-gray-500 prose-h6:italic prose-h6:mt-8 prose-h6:border-l-4 prose-h6:border-red-500 prose-h6:pl-4 prose-h6:bg-red-50/50 prose-h6:py-2
                        [&_p]:leading-[2] 
                        [&_p]:mb-6
                        [&_p]:text-gray-800
                        [&_p]:text-[17.5px]
                    "
                    >
                    <div
                        className="ql-editor !p-0"
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    />
                    </div>
                </div>
            </div>

            <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeInUp}
            >
                {/* Nút Chia Sẻ dạng Icon Tròn */}
                <div className="flex justify-end gap-3 mb-8">
                    <motion.button 
                        whileHover={{ y: -3, scale: 1.05, boxShadow: "0 8px 15px -4px rgba(0,104,255,0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleShareZalo}
                        title="Chia sẻ qua Zalo"
                        className="w-10 h-10 flex items-center justify-center bg-[#0068ff]/10 text-[#0068ff] hover:bg-[#0068ff] hover:text-white rounded-full transition-all duration-300 group"
                    >
                        {/* Icon Zalo vẽ lại chuẩn xác */}
                        <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none">
                            <path d="M21.5 11.5c0 5-4.5 9-10 9-1.5 0-2.9-.3-4.2-.9L3 21l1.5-4.5c-.8-1.2-1.3-2.6-1.3-4.2 0-5 4.5-9 10-9s10 4 10 9z" fill="currentColor"/>
                            <text x="11.5" y="14.5" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="Arial, sans-serif">Zalo</text>
                        </svg>
                    </motion.button>
                    
                    <motion.button 
                        whileHover={{ y: -3, scale: 1.05, boxShadow: "0 8px 15px -4px rgba(24,119,242,0.3)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleShareFacebook}
                        title="Chia sẻ qua Facebook"
                        className="w-10 h-10 flex items-center justify-center bg-[#1877f2]/10 text-[#1877f2] hover:bg-[#1877f2] hover:text-white rounded-full transition-all duration-300"
                    >
                        <FaFacebookF className="w-[18px] h-[18px]" />
                    </motion.button>
                </div>

                {/* Form Bình Luận dạng Gọn Nhẹ */}
                <div className="relative overflow-hidden bg-white/60 backdrop-blur-xl p-5 md:p-7 rounded-2xl border border-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] mb-8">
                    {/* Dải gradient mỏng phía trên */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-amber-400"></div>

                    <div className="relative z-10">
                        <h3 className="text-lg font-black text-gray-800 mb-4 tracking-tight flex items-center gap-2">
                            Bình luận bài viết
                        </h3>
                        
                        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                            <div>
                                <input 
                                    type="email" 
                                    required
                                    value={commentEmail}
                                    onChange={(e) => setCommentEmail(e.target.value)}
                                    placeholder="Email của bạn *"
                                    className="w-full p-3 rounded-xl border border-gray-200 bg-white/80 focus:bg-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all text-sm font-medium placeholder-gray-400 shadow-sm"
                                />
                            </div>

                            <div>
                                <textarea 
                                    required
                                    rows="2"
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                    placeholder="Chia sẻ ý kiến của bạn..."
                                    className="w-full p-3 rounded-xl border border-gray-200 bg-white/80 focus:bg-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all resize-y text-sm font-medium placeholder-gray-400 shadow-sm min-h-[80px]"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-2 mt-1">
                                <motion.button 
                                    whileHover={{ y: -1 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="button" 
                                    onClick={() => { setCommentEmail(''); setCommentContent(''); }}
                                    className="px-5 py-2 bg-white border border-gray-200 text-gray-500 hover:text-gray-700 rounded-xl text-sm font-bold transition-colors shadow-sm"
                                >
                                    Hủy
                                </motion.button>
                                <motion.button 
                                    whileHover={{ y: -1, boxShadow: "0 6px 15px -4px rgba(220,38,38,0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit" 
                                    className="px-6 py-2 bg-[#cc0000] text-white rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                                >
                                    <FaPaperPlane className="w-3 h-3" /> Gửi
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="font-bold text-red-800 uppercase border-b-2 border-red-700 pb-2 mb-6 tracking-wide">Bài viết mới nhất</h3>

            <div className="flex flex-col gap-6">
              {recentArticles.length > 0 ? (
                recentArticles.map(item => (
                  <Link key={item.id} to={`/article/${item.id}`} className="flex gap-4 group cursor-pointer">
                    <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-50 shadow-sm">
                      <img
                        src={item.thumbnail || getThumbnail(item.content)}
                        alt="thumb"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://tranhdaquy24h.com/public/upload/images/7ef5cf3972688e36d779.jpg";
                        }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-[14px] font-bold text-gray-800 group-hover:text-red-700 leading-snug line-clamp-2 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11.5px] text-gray-400 mt-1.5 font-sans">{formatDateTime(item.createdAt)}</p>
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