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

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf2] text-red-800 font-bold text-xl animate-pulse">
        Đang tải tài liệu...
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center overflow-hidden">

      {/* NỀN TRỐNG ĐỒNG CỦA KHẢI (Giữ nguyên) */}
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${BackgroundImage})` }}></div>
      <div className="absolute inset-0 z-[-1] bg-[#fcf9f2]"></div>

      {/* TOP BAR (Giữ nguyên) */}
      <div className="w-full z-50 p-4 md:p-6 flex justify-between items-center bg-gradient-to-b from-white/90 to-transparent">
        <button 
          onClick={() => navigate(-1)} 
          className="bg-red-700 hover:bg-red-800 transition-colors text-white font-bold py-2 px-4 md:px-6 rounded shadow-md active:scale-95 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Thoát
        </button>
        <div className="text-red-900 font-serif italic text-base md:text-xl font-bold bg-white/80 px-4 md:px-6 py-1.5 md:py-2 rounded-full shadow-sm max-w-[60%] truncate">
          {book.title}
        </div>
      </div>

      {/* KHUNG IFRAME ĐỌC SÁCH GOOGLE DRIVE */}
      <div className="relative z-10 w-full max-w-6xl h-[80vh] md:h-[85vh] px-2 md:px-6 pb-6">
        <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-red-800/20">
          <iframe
            src={book.pdfUrl} // NHỚ: Trong pgAdmin, url này phải có đuôi là /preview nhé!
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