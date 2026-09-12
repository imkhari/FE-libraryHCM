import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { QRCodeSVG } from 'qrcode.react';

// Card sách đồng bộ 100% với giao diện và hiệu ứng hover ở Trang chủ (Home.jsx)
const RelatedBookCard = ({ doc, navigate }) => {
  const [imgError, setImgError] = useState(false);
  const hasValidImageURL = doc.coverImageUrl && doc.coverImageUrl.trim() !== "" && doc.coverImageUrl !== "null";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={() => {
        window.scrollTo(0, 0);
        navigate(`/book/${doc.id}`);
      }}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 group cursor-pointer overflow-hidden w-full"
    >
      <div className="relative w-full aspect-[2/3] bg-gray-100 overflow-hidden shrink-0 border-b border-gray-100">
        {hasValidImageURL && !imgError ? (
          <img
            src={doc.coverImageUrl}
            alt={doc.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-3 text-center">
            <span className="text-red-800 text-[9px] font-bold uppercase tracking-widest mb-1 opacity-80 font-['Lora',serif]">{doc.author || "Tác giả"}</span>
            <span className="text-red-900 font-['Lora',serif] font-bold text-sm md:text-base leading-tight line-clamp-4">{doc.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-1.5 p-2 pointer-events-none">
          <span className="w-8 h-8 rounded-full bg-white/95 text-red-800 flex items-center justify-center shadow-md transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </span>
          <span className="bg-white/95 text-red-900 px-3 py-1 rounded-full text-xs font-semibold shadow-sm font-['Lora',serif] tracking-wide">
            Nhấn để đọc
          </span>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col bg-white">
        <h3 className="text-[13px] md:text-[14px] font-bold text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug font-['Lora',serif]">
          {doc.title}
        </h3>
        <div className="mt-auto pt-2">
          <p className="text-[11px] text-gray-500 font-medium line-clamp-1 italic font-['Lora',serif]">
            {doc.author || 'Đang cập nhật'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    api.get(`/documents/${id}`)
      .then((res) => {
        setBook(res.data);
        return api.get('/documents');
      })
      .then((res) => {
        let booksArray = [];

        if (Array.isArray(res.data)) {
          booksArray = res.data;
        } else if (res.data && Array.isArray(res.data.content)) {
          booksArray = res.data.content;
        } else if (res.data && Array.isArray(res.data.data)) {
          booksArray = res.data.data;
        }

        const related = booksArray
          .filter(b => b.id !== parseInt(id))
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);

        setRelatedBooks(related);
      })
      .catch((error) => console.error("Lỗi khi tải dữ liệu:", error))
      .finally(() => setLoading(false));
  }, [id]);

  const getDirectDownloadUrl = (url) => {
    if (!url) return null;

    const matchFileD = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (matchFileD && matchFileD[1]) {
      return `https://drive.google.com/uc?export=download&id=${matchFileD[1]}`;
    }

    const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchId && matchId[1]) {
      return `https://drive.google.com/uc?export=download&id=${matchId[1]}`;
    }

    return url;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#fcf9f2]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-700 mb-3"></div>
        <div className="text-red-800 font-['Lora',serif] italic text-sm">Đang tải thông tin tài liệu...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#fcf9f2] text-center px-4">
        <div className="text-xl font-bold text-gray-700 font-['Lora',serif] mb-4">Không tìm thấy tài liệu!</div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-sm font-bold text-white bg-[#da251d] hover:bg-red-800 px-5 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          Trở về Trang chủ
        </button>
      </div>
    );
  }

  const currentUrl = window.location.href;
  const downloadUrl = getDirectDownloadUrl(book.pdfUrl || book.pdf_url);

  return (
    <div className="min-h-screen bg-[#fcf9f2] py-6 md:py-8 px-4 font-sans selection:bg-red-200 relative">
      <div className="max-w-5xl mx-auto">

        {/* BREADCRUMB & BACK BUTTON */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 font-medium">
            <Link to="/" className="hover:text-red-700 transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link to="/category/book" className="hover:text-red-700 transition-colors">Tủ sách tư liệu</Link>
            <span>/</span>
            <span className="text-gray-800 font-semibold truncate max-w-[200px] md:max-w-[320px]">{book.title}</span>
          </nav>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-xs md:text-sm text-red-700 hover:text-red-900 font-bold transition-colors group cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại
          </button>
        </div>

        {/* MAIN BOOK SHOWCASE CARD - Thiết kế mềm mại, thanh thoát, không gò bó */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 p-6 md:p-10 flex flex-col md:flex-row gap-8 lg:gap-12 mb-14">

          {/* LEFT: BOOK COVER */}
          <div className="w-full md:w-1/3 flex justify-center items-start shrink-0">
            <div className="w-[200px] sm:w-[240px] md:w-[260px] aspect-[2/3] rounded-lg overflow-hidden shadow-[0_12px_30px_-6px_rgba(0,0,0,0.22)] border border-stone-200/80 bg-stone-100">
              <img
                src={book.coverImageUrl || "https://via.placeholder.com/300x450?text=No+Cover"}
                alt={book.title}
                className="w-full h-full object-cover select-none"
              />
            </div>
          </div>

          {/* RIGHT: BOOK DETAILS */}
          <div className="w-full md:w-2/3 flex flex-col justify-between">
            <div>
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-['Lora',serif] font-black text-gray-900 mb-4 leading-snug">
                {book.title}
              </h1>

              {/* Thông tin ngang - Tinh giản, mềm mại, thanh nhã */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 py-3 border-y border-stone-200/70 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-stone-400 text-xs uppercase font-medium">Tác giả:</span>
                  <span className="font-['Lora',serif] font-bold text-red-800">{book.author || "Hồ Chí Minh"}</span>
                </div>
                <div className="w-px h-3.5 bg-stone-200 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <span className="text-stone-400 text-xs uppercase font-medium">Năm phát hành:</span>
                  <span className="font-medium text-stone-700">{book.publisherYear || "Đang cập nhật"}</span>
                </div>
                <div className="w-px h-3.5 bg-stone-200 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <span className="text-stone-400 text-xs uppercase font-medium">Lượt đọc:</span>
                  <span className="font-medium text-stone-700">{Number(book.views || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Tóm tắt nội dung */}
              <div className="mb-8">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2 font-sans">
                  Giới thiệu nội dung
                </h3>
                <p className="text-stone-700 font-['Lora',serif] italic leading-relaxed text-sm md:text-[15px] text-left">
                  {book.description || "Tài liệu này hiện đang trong quá trình cập nhật nội dung tóm tắt chi tiết."}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => navigate(`/reader/${book.id}`)}
                className="flex-1 bg-[#da251d] hover:bg-red-800 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 active:scale-95 cursor-pointer text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Đọc trực tuyến</span>
              </button>

              {downloadUrl ? (
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="flex-1 bg-white hover:bg-stone-50 text-stone-800 font-bold py-3 px-6 rounded-xl border border-stone-300 shadow-xs transition-all flex justify-center items-center gap-2 active:scale-95 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Tải file PDF</span>
                </a>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-stone-100 text-stone-400 font-medium py-3 px-6 rounded-xl border border-stone-200 flex justify-center items-center gap-2 cursor-not-allowed text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Không có file tải</span>
                </button>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  title="Sao chép liên kết tài liệu"
                  className="w-12 h-12 shrink-0 bg-white hover:bg-red-50 text-stone-600 hover:text-red-700 font-bold rounded-xl border border-stone-300 shadow-xs transition-all flex items-center justify-center active:scale-95 cursor-pointer relative"
                >
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                  {copied && (
                    <span className="absolute -top-9 bg-gray-900 text-white text-[10px] font-medium px-2 py-1 rounded shadow whitespace-nowrap animate-fade-in">
                      Đã chép link!
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setShowQR(true)}
                  title="Quét mã QR để đọc trên điện thoại"
                  className="w-12 h-12 shrink-0 bg-white hover:bg-red-50 text-stone-600 hover:text-red-700 font-bold rounded-xl border border-stone-300 shadow-xs transition-all flex items-center justify-center active:scale-95 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED BOOKS - Đồng bộ 100% card và hover với Trang chủ */}
        {relatedBooks.length > 0 && (
          <div className="mt-14 mb-8">
            <div className="flex items-center justify-between mb-6 border-b-2 border-red-100 pb-3">
              <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-wide flex items-center gap-3 font-['Lora',serif]">
                <span className="w-2 h-7 bg-red-700 rounded-full"></span>
                Tác phẩm liên quan
              </h2>
              <span className="text-xs text-stone-500 hidden sm:inline">Gợi ý đọc thêm</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedBooks.map((relatedBook) => (
                <RelatedBookCard key={relatedBook.id} doc={relatedBook} navigate={navigate} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* QR CODE MODAL */}
      {showQR && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full flex flex-col items-center relative transform scale-100 opacity-100 animate-[fadeIn_0.2s_ease-out]">

            <button
              onClick={() => setShowQR(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-700 transition-colors bg-stone-100 hover:bg-red-50 p-1.5 rounded-full cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-black text-gray-900 mb-1.5 font-['Lora',serif]">Quét mã QR</h3>
            <p className="text-xs text-gray-500 text-center mb-5 font-['Lora',serif]">
              Dùng camera điện thoại hoặc Zalo quét mã để mở tài liệu trên điện thoại.
            </p>

            <div className="bg-white p-4 rounded-xl shadow-inner border border-stone-200">
              <QRCodeSVG
                value={currentUrl}
                size={190}
                level="M"
                fgColor="#b91c1c"
              />
            </div>

            <button
              onClick={handleCopyLink}
              className="mt-5 w-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copied ? "Đã sao chép link!" : "Sao chép link tài liệu"}
            </button>

            <p className="mt-4 text-[10px] text-red-700 font-bold tracking-widest uppercase font-['Lora',serif]">
              Không gian văn hoá Hồ Chí Minh
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

export default BookDetail;