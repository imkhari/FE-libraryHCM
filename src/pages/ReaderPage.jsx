import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';
import api from '../services/api';

import BackgroundImage from '../assets/bg3.jpg';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PAGE_WIDTH = 450;
const PAGE_HEIGHT = 636;

const PDFPage = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="w-full h-full bg-white border-r border-gray-200 overflow-hidden flex justify-center items-center shadow-[inset_0_0_15px_rgba(0,0,0,0.05)]">
      <Page
        pageNumber={props.number}
        width={PAGE_WIDTH}
        renderAnnotationLayer={false}
        renderTextLayer={false}
        loading={<div className="animate-pulse text-gray-300">...</div>}
      />
    </div>
  );
});

function ReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const bookRef = useRef();

  const [book, setBook] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // LOGIC ZOOM AN TOÀN
  const [scale, setScale] = useState(1);
  const lastTap = useRef(0);

  useEffect(() => {
    api.get(`/documents/${id}`).then((res) => setBook(res.data)).catch(() => setLoading(false));
  }, [id]);

  const handleToggleZoom = (e) => {
    // Ngăn chặn sự kiện lan xuống lớp flipbook bên dưới
    if (e) {
      if (e.stopPropagation) e.stopPropagation();
      if (e.preventDefault) e.preventDefault();
    }
    setScale((prev) => (prev === 1 ? 1.6 : 1));
  };

  const handleTouchStart = (e) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
      handleToggleZoom(e);
    }
    lastTap.current = now;
  };

  const onPage = (e) => setCurrentPage(e.data);

  if (!book) return <div className="min-h-screen flex items-center justify-center bg-[#fdfbf2]">Đang tải...</div>;

  // const pdfFileUrl = `/pdfs/${book.pdfUrl}`;
  const pdfFileUrl = book.pdfUrl;

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center overflow-hidden py-4">

      {/* NỀN TRỐNG ĐỒNG */}
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${BackgroundImage})` }}></div>
      <div className="absolute inset-0 z-[-1] bg-[#fcf9f2]"></div>

      {/* TOP BAR */}
      <div className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-white/90 to-transparent">
        <button onClick={() => navigate(-1)} className="bg-red-700 text-white font-bold py-2 px-6 rounded shadow-md active:scale-95 flex items-center gap-2">
          ← Thoát
        </button>
        <div className="text-red-900 font-serif italic text-xl font-bold bg-white/70 px-6 py-1.5 rounded-full shadow-sm">
          {book.title}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl flex items-center justify-center">

        {/* Nút lật TRÁI */}
        <button
          onClick={() => bookRef.current.pageFlip().flipPrev()}
          className="z-50 bg-gray-400/50 hover:bg-gray-500 text-white p-3 rounded mr-4 shadow-sm hidden md:block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* CONTAINER ZOOM */}
        <div
          className="relative flex justify-center transition-all duration-500 ease-in-out cursor-default"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {/* 🛡️ TẤM KHIÊN TÀNG HÌNH: Chặn đứng sự kiện lật trang khi đang Zoom */}
          {scale > 1 && (
            <div
              className="absolute inset-0 z-[60] bg-transparent"
              onDoubleClick={handleToggleZoom}
              onTouchStart={handleTouchStart}
            />
          )}

          <div
            className="drop-shadow-2xl z-10"
            onDoubleClick={scale === 1 ? handleToggleZoom : undefined}
            onTouchStart={scale === 1 ? handleTouchStart : undefined}
          >
            <Document file={pdfFileUrl} onLoadSuccess={({ numPages }) => { setNumPages(numPages); setLoading(false); }}>
              {numPages && (
                <HTMLFlipBook
                  width={PAGE_WIDTH}
                  height={PAGE_HEIGHT}
                  size="stretch"
                  minWidth={450}
                  maxWidth={550}
                  showCover={true}
                  usePortrait={false}
                  flippingTime={1000}
                  onFlip={onPage}
                  ref={bookRef}
                  // Khóa hoàn toàn tính năng lật trang bằng chuột/vuốt khi đang Zoom
                  useMouseEvents={scale === 1}
                  clickEventForward={false}
                  className="flip-book shadow-2xl bg-white"
                >
                  {Array.from(new Array(numPages), (el, index) => (
                    <PDFPage key={`page_${index + 1}`} number={index + 1} />
                  ))}
                </HTMLFlipBook>
              )}
            </Document>
          </div>
        </div>

        {/* Nút lật PHẢI */}
        <button
          onClick={() => bookRef.current.pageFlip().flipNext()}
          className="z-50 bg-gray-400/50 hover:bg-gray-500 text-white p-3 rounded ml-4 shadow-sm hidden md:block"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {numPages && (
        <div className="absolute bottom-8 z-50 bg-white/90 border px-6 py-2 rounded-full text-gray-700 font-serif font-bold shadow-sm">
          Trang {currentPage + 1} / {numPages}
        </div>
      )}
    </div>
  );
}

export default ReaderPage;