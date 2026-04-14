import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cuộn lên đầu trang mỗi khi ID thay đổi (chọn sách liên quan)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    // 1. Gọi API lấy thông tin sách hiện tại
    api.get(`/documents/${id}`)
      .then((res) => {
        setBook(res.data);
        
        // 2. Gọi API lấy các tác phẩm liên quan 
        return api.get('/documents');
      })
      .then((res) => {
        // Trích xuất mảng an toàn
        let booksArray = [];
        
        if (Array.isArray(res.data)) {
          booksArray = res.data; 
        } else if (res.data && Array.isArray(res.data.content)) {
          booksArray = res.data.content; 
        } else if (res.data && Array.isArray(res.data.data)) {
          booksArray = res.data.data; 
        } else {
          console.warn("Không tìm thấy cấu trúc mảng hợp lệ từ API", res.data);
        }

        // 🌟 LOGIC MỚI: Xáo trộn ngẫu nhiên (Random) trước khi lấy 4 cuốn
        const related = booksArray
          .filter(b => b.id !== parseInt(id)) // Loại bỏ cuốn đang xem
          .sort(() => 0.5 - Math.random())    // Xáo trộn mảng ngẫu nhiên
          .slice(0, 4);                       // Cắt lấy 4 cuốn đầu tiên
          
        setRelatedBooks(related);
      })
      .catch((error) => console.error("Lỗi khi tải dữ liệu:", error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#fcf9f2]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-700 mb-3"></div>
        <div className="text-red-800 font-serif italic">Đang tải thông tin tài liệu...</div>
      </div>
    );
  }

  if (!book) {
    return <div className="min-h-[60vh] flex items-center justify-center text-xl font-bold text-gray-500">Không tìm thấy tài liệu!</div>;
  }

  return (
    <div className="min-h-screen bg-[#fcf9f2] py-8 px-4 font-sans selection:bg-red-200">
      <div className="max-w-6xl mx-auto">
        
        {/* === NÚT QUAY LẠI === */}
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-red-700 hover:text-red-900 font-bold mb-6 transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Quay lại Tủ Sách
        </button>

        {/* === CARD THÔNG TIN CHÍNH === */}
        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-50 p-6 md:p-10 flex flex-col md:flex-row gap-8 mb-12">
          
          {/* CỘT TRÁI: ẢNH BÌA */}
          <div className="w-full md:w-1/3 flex justify-center items-start shrink-0">
            <div className="relative group">
              <img 
                src={book.coverImageUrl || "https://via.placeholder.com/300x450?text=No+Cover"} 
                alt={book.title} 
                className="w-full max-w-[280px] h-auto object-cover rounded shadow-lg border border-gray-200 group-hover:shadow-2xl transition-shadow duration-300"
              />
            </div>
          </div>

          {/* CỘT PHẢI: CHI TIẾT */}
          <div className="w-full md:w-2/3 flex flex-col">
            <h4 className="text-red-700 font-bold text-xs uppercase tracking-widest mb-2">Thông tin tài liệu</h4>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">{book.title}</h1>
            
            <div className="w-full h-px bg-gray-200 mb-6"></div>

            {/* Bảng thông số */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-red-50/50 p-4 rounded-lg border border-red-100">
                <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider mb-1">Tác giả</p>
                <p className="font-bold text-gray-900">{book.author || "Đang cập nhật"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider mb-1">Năm xuất bản</p>
                <p className="font-bold text-gray-900">{book.publisherYear || "Đang cập nhật"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider mb-1">Lượt xem</p>
                <p className="font-bold text-gray-900">{book.views || 0}</p>
              </div>
            </div>

            {/* Giới thiệu nội dung */}
            <div className="mb-10 flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Giới thiệu nội dung:</h3>
              <p className="text-gray-600 italic leading-relaxed text-justify">
                {book.description || "Tài liệu này hiện chưa có bài tóm tắt nội dung."}
              </p>
            </div>

            {/* Các nút hành động */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button 
                onClick={() => navigate(`/reader/${book.id}`)}
                className="flex-1 bg-[#da251d] hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Đọc trực tuyến
              </button>
              
              <a 
                href={book.pdfUrl} 
                target="_blank" 
                rel="noreferrer"
                download
                className="flex-1 bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-6 rounded-lg border-2 border-gray-200 shadow-sm transition-all flex justify-center items-center gap-2 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Tải file PDF
              </a>
            </div>
          </div>
        </div>

        {/* === PHẦN TÁC PHẨM LIÊN QUAN === */}
        {relatedBooks.length > 0 && (
          <div className="mt-16 mb-8">
            <div className="flex items-center justify-between mb-8 border-b-2 border-red-100 pb-3">
              <h2 className="text-2xl font-black text-gray-800 uppercase tracking-wide flex items-center gap-3">
                <span className="w-2 h-8 bg-red-700 rounded-full"></span>
                Tác phẩm liên quan
              </h2>
            </div>
            
            {/* Lưới sách liên quan */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedBooks.map((relatedBook) => (
                <div 
                  key={relatedBook.id} 
                  onClick={() => navigate(`/book/${relatedBook.id}`)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative aspect-[2/3] overflow-hidden rounded shadow-sm mb-4 bg-gray-100">
                    <img 
                      src={relatedBook.coverImageUrl || "https://via.placeholder.com/150x220?text=No+Cover"} 
                      alt={relatedBook.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full">Xem chi tiết</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base line-clamp-2 mb-1 group-hover:text-red-700 transition-colors">
                    {relatedBook.title}
                  </h3>
                  <p className="text-gray-500 text-xs truncate">
                    {relatedBook.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default BookDetail;