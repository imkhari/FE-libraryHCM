import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

import BackgroundImage from '../assets/bg3.jpg';

function ReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);

  // Gọi API lấy dữ liệu sách
  useEffect(() => {
    api.get(`/documents/${id}`)
       .then((res) => setBook(res.data))
       .catch((err) => console.error("Lỗi tải sách:", err));
  }, [id]);

  // 🌟 HÀM XỬ LÝ: Tự động trích xuất ID và tạo link Tải xuống trực tiếp từ Google Drive 🌟
  const getDownloadUrl = (url) => {
    if (!url) return "#";
    
    // Tìm ID nếu link có dạng /file/d/ID_FILE/...
    const matchFileD = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (matchFileD && matchFileD[1]) {
      return `https://drive.google.com/uc?export=download&id=${matchFileD[1]}`;
    }
    
    // Tìm ID nếu link có dạng ?id=ID_FILE
    const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchId && matchId[1]) {
      return `https://drive.google.com/uc?export=download&id=${matchId[1]}`;
    }
    
    // Nếu không khớp định dạng nào, trả về link gốc
    return url;
  };

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf2] text-red-800 font-bold text-xl animate-pulse">
        Đang tải tài liệu...
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center overflow-hidden">

      {/* NỀN TRỐNG ĐỒNG */}
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${BackgroundImage})` }}></div>
      <div className="absolute inset-0 z-[-1] bg-[#fcf9f2]"></div>

      {/* TOP BAR */}
      <div className="w-full z-50 p-4 md:p-6 flex justify-between items-center bg-gradient-to-b from-white/90 to-transparent gap-2">
        
        {/* NÚT THOÁT */}
        <button 
          onClick={() => navigate(-1)} 
          className="bg-red-700 hover:bg-red-800 transition-colors text-white font-bold py-2 px-3 md:px-6 rounded shadow-md active:scale-95 flex items-center gap-1 md:gap-2 shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="hidden md:inline">Thoát</span>
        </button>

        {/* TÊN SÁCH Ở GIỮA */}
        <div className="text-red-900 font-serif italic text-sm md:text-xl font-bold bg-white/80 px-4 md:px-6 py-1.5 md:py-2 rounded-full shadow-sm max-w-[40%] md:max-w-[60%] truncate text-center">
          {book.title}
        </div>

        {/* 🌟 NÚT TẢI XUỐNG MỚI THÊM 🌟 */}
        <a 
          href={getDownloadUrl(book.pdfUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800 hover:bg-gray-900 transition-colors text-white font-bold py-2 px-3 md:px-6 rounded shadow-md active:scale-95 flex items-center gap-1 md:gap-2 shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span className="hidden md:inline">Tải xuống</span>
        </a>

      </div>

      {/* KHUNG IFRAME ĐỌC SÁCH GOOGLE DRIVE */}
      <div className="relative z-10 w-full max-w-6xl h-[80vh] md:h-[88vh] px-2 md:px-6 pb-6 mt-2">
        <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-red-800/20 relative">
          
          <iframe
            src={book.pdfUrl}
            className="w-full h-full border-none"
            title={book.title}
            allow="autoplay"
          >
            <p>Trình duyệt của bạn không hỗ trợ iframe. Hãy nâng cấp trình duyệt!</p>
          </iframe>

        </div>
      </div>

    </div>
  );
}

export default ReaderPage;