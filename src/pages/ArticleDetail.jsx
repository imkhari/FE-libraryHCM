import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import 'react-quill-new/dist/quill.snow.css';
import { FaFacebookF, FaTelegramPlane, FaPaperPlane } from 'react-icons/fa';
import { 
  HiCalendar, 
  HiLink, 
  HiPrinter, 
  HiArrowLeft, 
  HiCheck 
} from 'react-icons/hi';
import toast from 'react-hot-toast';

function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tùy chỉnh kích cỡ chữ đọc bài (A- / A / A+)
  const fontSizes = [
    { label: 'A-', sizeClass: 'text-[16px] leading-[1.85]', title: 'Cỡ chữ vừa' },
    { label: 'A', sizeClass: 'text-[18px] leading-[1.95]', title: 'Cỡ chữ tiêu chuẩn' },
    { label: 'A+', sizeClass: 'text-[20.5px] leading-[2.1]', title: 'Cỡ chữ lớn' }
  ];
  const [fontSizeIdx, setFontSizeIdx] = useState(1);

  // State cho nút Copy Link
  const [copied, setCopied] = useState(false);

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

        const listRes = await api.get('/articles');
        const listData = (listRes.data || []).map(item => ({
          id: item.id,
          title: item.title,
          createdAt: item.createdAt,
          thumbnail: item.thumbnailUrl || "https://tranhdaquy24h.com/public/upload/images/7ef5cf3972688e36d779.jpg"
        }));

        const otherArticles = listData
          .filter(item => item.id.toString() !== id.toString())
          .slice(0, 5);

        setRecentArticles(otherArticles);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết bài viết:", error);
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
    try {
      const safeDate = dateString.endsWith('Z') || dateString.includes('+') ? dateString : `${dateString}Z`;
      const d = new Date(safeDate);
      const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const date = d.toLocaleDateString('vi-VN');
      return `${time} | ${date}`;
    } catch {
      return dateString;
    }
  };

  // Làm sạch văn bản tránh lỗi ký tự vô hình
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

  // Chia sẻ bài viết
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank', 'width=600,height=400');
  };

  const handleShareZalo = () => {
    window.open(`https://zalo.me/share?url=${encodeURIComponent(currentUrl)}`, '_blank', 'width=600,height=400');
  };

  const handleShareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article?.title || '')}`, '_blank', 'width=600,height=400');
  };

  const handleCopyLink = () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(window.location.href);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      toast.success("Đã copy liên kết bài viết!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Không thể sao chép liên kết!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Gửi bình luận
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentEmail.trim() || !commentContent.trim()) {
      toast.error("Vui lòng nhập đầy đủ email và nội dung bình luận!");
      return;
    }

    toast.success("Bình luận của bạn đã được gửi thành công!");
    setCommentEmail('');
    setCommentContent('');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fcf9f2] py-8 px-4 font-['Lora',serif]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-transparent animate-pulse">
          <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-stone-200 mb-6">
            <div className="h-4 bg-slate-200 rounded w-44 mb-6"></div>
            <div className="h-10 bg-slate-200 rounded w-full mb-3"></div>
            <div className="h-10 bg-slate-200 rounded w-2/3 mb-8"></div>
            <div className="h-4 bg-slate-200 rounded w-64 mb-8 pb-4 border-b border-stone-100"></div>

            <div className="h-64 sm:h-96 bg-slate-200 rounded-2xl w-full mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/2 mb-6"></div>
            <div className="flex flex-col gap-6">
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

  if (!article) return (
    <div className="min-h-screen bg-[#fcf9f2] flex flex-col justify-center items-center font-['Lora',serif] p-6 text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl mb-4">
        ✕
      </div>
      <h2 className="text-2xl font-black text-stone-900 mb-2">Không tìm thấy bài viết</h2>
      <p className="text-stone-500 text-sm mb-6 max-w-sm">Bài viết có thể đã được gỡ bỏ hoặc đường dẫn không còn tồn tại.</p>
      <button 
        onClick={() => navigate('/news')}
        className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-sm font-bold shadow-md transition-colors cursor-pointer"
      >
        ← Quay lại trang Tin tức
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcf9f2] py-6 sm:py-8 px-4 font-['Lora',serif] selection:bg-red-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* CỘT NỘI DUNG CHÍNH (8 PHẦN) */}
        <div className="lg:col-span-8">
          {/* KHUNG BÀI VIẾT (IN ĐỘC LẬP VỚI ID PRINTABLE-ARTICLE) */}
          <div id="printable-article" className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-xs border border-stone-200/80 mb-8 relative">

            {/* THANH BREADCRUMB & NÚT QUAY LẠI (/news) */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-4 border-b border-stone-100 font-sans text-xs no-print">
              <nav className="flex items-center gap-1.5 text-stone-500 overflow-x-auto">
                <Link to="/" className="hover:text-red-700 transition-colors shrink-0">Trang chủ</Link>
                <span>/</span>
                <Link to="/news" className="hover:text-red-700 transition-colors shrink-0">Tin tức - Sự kiện</Link>
                <span>/</span>
                <span className="text-red-800 font-bold shrink-0">
                  {article.category === 'TIN_TUC' ? 'Tin tức' : 'Học tập & Làm theo Bác'}
                </span>
              </nav>

              <button 
                onClick={() => navigate('/news')} 
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 font-bold text-xs transition-all border border-stone-200/80 cursor-pointer hover:shadow-xs"
              >
                <HiArrowLeft className="w-3.5 h-3.5" />
                <span>Danh sách bài viết</span>
              </button>
            </div>

            {/* TAG CHUYÊN MỤC */}
            <div className="mb-3.5">
              {article.category === 'TIN_TUC' ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 shadow-2xs font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse no-print"></span>
                  Tin tức
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 no-print"></span>
                  Học tập & Làm theo Bác
                </span>
              )}
            </div>

            {/* TIÊU ĐỀ BÀI VIẾT */}
            <h1 className="text-2xl sm:text-3xl md:text-[36px] font-black text-stone-900 mb-5 leading-[1.28] tracking-tight">
              {article.title}
            </h1>

            {/* DÒNG THÔNG TIN META & BỘ CÔNG CỤ ĐỌC BÀI */}
            <div className="flex items-center justify-between flex-wrap gap-4 text-xs text-stone-500 mb-8 pb-5 border-b border-stone-100 font-sans">
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <HiCalendar className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Đăng lúc: <strong className="text-stone-700 font-mono">{formatDateTime(article.createdAt || article.publishDate)}</strong></span>
                </span>
                
                <span className="text-stone-300 hidden sm:inline">•</span>

                <span className="flex items-center gap-1.5">
                  <span className="text-stone-700">Tác giả: <strong className="text-stone-800 font-bold">{article.author?.fullName || article.author || "Ban Biên Tập"}</strong></span>
                </span>
              </div>

              {/* BỘ CÔNG CỤ ĐỌC: TĂNG GIẢM CỠ CHỮ & IN BÀI VIẾT */}
              <div className="flex items-center gap-2 bg-stone-50 p-1 rounded-xl border border-stone-200/80 no-print">
                <span className="text-[11px] text-stone-400 px-1 font-medium hidden sm:inline">Cỡ chữ:</span>
                {fontSizes.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    title={item.title}
                    onClick={() => setFontSizeIdx(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                      fontSizeIdx === idx
                        ? 'bg-red-700 text-white shadow-2xs'
                        : 'bg-white text-stone-600 hover:bg-stone-200/70 border border-stone-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                <button
                  type="button"
                  title="In riêng bài viết này"
                  onClick={handlePrint}
                  className="w-7 h-7 rounded-lg text-stone-600 hover:text-red-700 hover:bg-stone-200/70 transition-colors flex items-center justify-center cursor-pointer ml-1"
                >
                  <HiPrinter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* NỘI DUNG CHI TIẾT BÀI VIẾT */}
            <div className="relative">
              <style dangerouslySetInnerHTML={{
                __html: `
                .article-content-wrapper {
                  font-family: 'Lora', serif;
                }

                .article-content-wrapper img {
                  max-width: 100% !important;
                  max-height: 520px !important;
                  width: auto !important;
                  height: auto !important;
                  object-fit: cover !important;
                  margin: 2rem auto !important;
                  display: block !important;
                  border-radius: 16px !important;
                  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1) !important;
                  border: 1px solid rgba(0, 0, 0, 0.05) !important;
                }

                .article-content-wrapper h2, 
                .article-content-wrapper h3 {
                  font-size: 1.35rem !important;
                  font-weight: 800 !important;
                  color: #1c1917 !important;
                  border-left: 4px solid #dc2626 !important;
                  padding-left: 0.85rem !important;
                  margin-top: 2.25rem !important;
                  margin-bottom: 1rem !important;
                  line-height: 1.4 !important;
                }

                .article-content-wrapper blockquote {
                  border-left: 4px solid #b91c1c !important;
                  background: #fff8f8 !important;
                  padding: 1.15rem 1.4rem !important;
                  margin: 2rem 0 !important;
                  border-radius: 0 14px 14px 0 !important;
                  font-style: italic !important;
                  color: #44403c !important;
                  box-shadow: 0 2px 10px rgba(185, 28, 28, 0.04) !important;
                }

                .article-content-wrapper ul, 
                .article-content-wrapper ol {
                  padding-left: 1.6rem !important;
                  margin: 1.25rem 0 !important;
                }

                .article-content-wrapper li {
                  margin-bottom: 0.5rem !important;
                  line-height: 1.8 !important;
                  color: #292524 !important;
                }

                .article-content-wrapper .ql-align-center,
                .article-content-wrapper [style*="text-align: center"],
                .article-content-wrapper [style*="text-align:center"] {
                  text-align: center !important;
                  display: block !important;
                }

                .article-content-wrapper iframe {
                  width: 100% !important;
                  aspect-ratio: 16 / 9 !important;
                  border-radius: 16px !important;
                  margin: 2rem auto !important;
                }

                /* CHẾ ĐỘ IN ẤN: CHỈ IN DUY NHẤT BÀI VIẾT */
                @media print {
                  body * {
                    visibility: hidden !important;
                  }

                  #printable-article,
                  #printable-article * {
                    visibility: visible !important;
                  }

                  #printable-article {
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 15px !important;
                    background: #ffffff !important;
                    border: none !important;
                    box-shadow: none !important;
                  }

                  .no-print {
                    display: none !important;
                  }

                  .article-content-wrapper {
                    font-size: 13pt !important;
                    line-height: 1.65 !important;
                    color: #111111 !important;
                  }

                  .article-content-wrapper img {
                    max-width: 80% !important;
                    page-break-inside: avoid !important;
                    box-shadow: none !important;
                    border: 1px solid #e2e8f0 !important;
                  }

                  .article-content-wrapper blockquote {
                    page-break-inside: avoid !important;
                  }
                }
              `}} />

              <div className="article-content-wrapper ql-snow prose max-w-none">
                <div
                  className={`ql-editor !p-0 ${fontSizes[fontSizeIdx].sizeClass} text-stone-800`}
                  dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
              </div>
            </div>

            {/* THANH CHIA SẺ BÀI VIẾT (ZALO, FACEBOOK, TELEGRAM & COPY LINK VỚI HOVER XANH LÁ CÂY DỊU MẮT) */}
            <div className="mt-10 pt-6 border-t border-stone-200/80 flex items-center justify-end font-sans no-print">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-xs text-stone-500 font-medium mr-1">Chia sẻ:</span>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={handleShareFacebook}
                  title="Chia sẻ lên Facebook"
                  className="w-8 h-8 rounded-full bg-[#1877f2]/10 text-[#1877f2] hover:bg-[#1877f2] hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                >
                  <FaFacebookF className="w-3.5 h-3.5" />
                </button>

                {/* Zalo */}
                <button
                  type="button"
                  onClick={handleShareZalo}
                  title="Chia sẻ qua Zalo"
                  className="w-8 h-8 rounded-full bg-[#0068ff]/10 text-[#0068ff] hover:bg-[#0068ff] hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-2xs font-bold text-[10px]"
                >
                  Zalo
                </button>

                {/* Telegram */}
                <button
                  type="button"
                  onClick={handleShareTelegram}
                  title="Chia sẻ qua Telegram"
                  className="w-8 h-8 rounded-full bg-[#229ed9]/10 text-[#229ed9] hover:bg-[#229ed9] hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-2xs"
                >
                  <FaTelegramPlane className="w-3.5 h-3.5" />
                </button>

                {/* Nút Copy link với hiệu ứng xanh lá cây dịu mắt */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  title="Sao chép liên kết bài viết"
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer border ${
                    copied
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                      : 'bg-stone-100/90 text-stone-700 border-stone-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                  }`}
                >
                  {copied ? (
                    <>
                      <HiCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã copy</span>
                    </>
                  ) : (
                    <>
                      <HiLink className="w-3.5 h-3.5 text-stone-500 transition-colors" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* KHU VỰC BÌNH LUẬN BÀI VIẾT (GIỮ NHƯ CŨ) */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs mb-8 no-print">
            <h3 className="font-bold text-stone-900 text-base mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-red-700 rounded-full inline-block"></span>
              Bình luận bài viết
            </h3>
            
            <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3.5 font-sans">
              <div>
                <input 
                  type="email" 
                  required
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  placeholder="Email của bạn *"
                  className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all text-xs sm:text-sm font-medium placeholder-stone-400"
                />
              </div>

              <div>
                <textarea 
                  required
                  rows="3"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Chia sẻ ý kiến của bạn về bài viết..."
                  className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all resize-y text-xs sm:text-sm font-medium placeholder-stone-400 min-h-[80px]"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 mt-1">
                <button 
                  type="button" 
                  onClick={() => { setCommentEmail(''); setCommentContent(''); }}
                  className="px-4 py-2 bg-white border border-stone-200 text-stone-500 hover:text-stone-700 rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:shadow-md"
                >
                  <FaPaperPlane className="w-3 h-3" /> Gửi
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* CỘT BÀI VIẾT MỚI NHẤT (SIDEBAR 4 PHẦN) */}
        <div className="lg:col-span-4 space-y-6 no-print">
          <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-xs border border-stone-200/80 sticky top-24">
            
            <div className="flex items-center justify-between pb-3.5 mb-5 border-b-2 border-red-700">
              <h3 className="font-black text-red-800 uppercase tracking-wide text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                <span>Bài viết mới nhất</span>
              </h3>
              <Link to="/news" className="text-[11px] font-sans font-bold text-stone-400 hover:text-red-700 transition-colors">
                Xem tất cả →
              </Link>
            </div>

            <div className="flex flex-col gap-4 divide-y divide-stone-100">
              {recentArticles.length > 0 ? (
                recentArticles.map(item => (
                  <Link 
                    key={item.id} 
                    to={`/article/${item.id}`} 
                    className="flex gap-3.5 group cursor-pointer pt-3.5 first:pt-0"
                  >
                    {/* Ảnh đại diện bài viết bên phải */}
                    <div className="w-20 h-16 sm:w-22 sm:h-18 shrink-0 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60 shadow-2xs">
                      <img
                        src={item.thumbnail || getThumbnail(item.content)}
                        alt={item.title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/anh-bac-Ho.jpg";
                        }}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                    </div>

                    <div className="flex flex-col justify-center min-w-0">
                      <h4 className="text-xs sm:text-[13px] font-bold text-stone-800 group-hover:text-red-700 leading-snug line-clamp-2 transition-colors mb-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 font-mono flex items-center gap-1.5 font-sans mt-0.5">
                        <HiCalendar className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>{formatDateTime(item.createdAt)}</span>
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-stone-400 italic py-4">Đang cập nhật bài viết liên quan...</p>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ArticleDetail;