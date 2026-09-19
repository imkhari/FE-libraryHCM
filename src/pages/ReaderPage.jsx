import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import api from '../services/api';
import BackgroundImage from '../assets/bg3.jpg';

// Cấu hình worker cho PDF.js trong môi trường Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Component render 1 trang PDF độc lập với IntersectionObserver (Lazy load chuẩn - chỉ tải khi cuộn tới)
function PdfPageItem({ pageNumber, pdfDoc, zoomScale, defaultPageSize, pageFilter, bookShadow, onVisible, theme }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isRendered, setIsRendered] = useState(false);
  const [pageSize, setPageSize] = useState(defaultPageSize || { width: 650, height: 850 });
  const renderTaskRef = useRef(null);

  // Cập nhật lại kích thước khi zoom thay đổi dựa trên tỷ lệ chuẩn
  useEffect(() => {
    if (defaultPageSize) {
      setPageSize({
        width: defaultPageSize.width,
        height: defaultPageSize.height,
      });
    }
  }, [defaultPageSize]);

  // Vẽ trang lên Canvas CHỈ KHI TRANG NẰM TRONG TẦM MẮT
  const renderPage = useCallback(async () => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      // Chỉ gọi getPage khi thực sự cần vẽ trang này
      const page = await pdfDoc.getPage(pageNumber);
      const viewport = page.getViewport({ scale: zoomScale });
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Tự động cập nhật kích thước chính xác nếu trang này khác trang 1
      setPageSize({ width: viewport.width, height: viewport.height });

      const outputScale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

      const renderContext = {
        canvasContext: context,
        transform: transform,
        viewport: viewport,
      };

      const task = page.render(renderContext);
      renderTaskRef.current = task;
      await task.promise;
      setIsRendered(true);
    } catch (err) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error(`Lỗi vẽ trang ${pageNumber}:`, err);
      }
    }
  }, [pdfDoc, pageNumber, zoomScale]);

  // Quan sát khi trang cuộn vào tầm mắt thì mới bắt đầu nạp và vẽ (True Lazy Load)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onVisible(pageNumber);
            renderPage();
          }
        });
      },
      {
        root: null,
        rootMargin: '400px 0px 400px 0px', // Nạp trước khi trang cách màn hình 400px để người đọc cuộn mượt
        threshold: 0.1,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [pageNumber, onVisible, renderPage]);

  // Vẽ lại khi zoom thay đổi nếu trang đã từng được render
  useEffect(() => {
    if (isRendered) {
      renderPage();
    }
  }, [zoomScale, renderPage, isRendered]);

  return (
    <div
      ref={containerRef}
      id={`pdf-page-${pageNumber}`}
      className="relative my-4 md:my-6 transition-all duration-300 flex flex-col items-center select-none"
      style={{ minHeight: `${pageSize.height}px` }}
    >
      {/* Khung trang sách: Nền trắng sáng tự nhiên, chữ đen nét căng */}
      <div
        className={`relative rounded-sm overflow-hidden border border-stone-200/80 dark:border-stone-800 transition-all bg-white ${bookShadow}`}
        style={{
          width: `${pageSize.width}px`,
          minHeight: `${pageSize.height}px`,
          filter: pageFilter,
        }}
      >
        <canvas ref={canvasRef} className="block w-full h-auto" />

        {/* Placeholder nhẹ khi chưa cuộn tới */}
        {!isRendered && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-50/90 text-stone-400 font-mono text-xs">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-stone-300 border-t-red-600 mb-2"></div>
            <span>Đang chuẩn bị trang {pageNumber}...</span>
          </div>
        )}
      </div>

      {/* Số trang chân trang */}
      <div className={`mt-2 text-[11px] font-mono font-medium tracking-wider ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
        — Trang {pageNumber} —
      </div>
    </div>
  );
}

function ReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [theme, setTheme] = useState('light'); // 'light', 'sepia', 'dark'
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // PDF.js State
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [basePageSize, setBasePageSize] = useState({ width: 595, height: 842 });
  const [zoomScale, setZoomScale] = useState(1.15);
  const [drivePreviewUrl, setDrivePreviewUrl] = useState(null);
  const [activePdfUrl, setActivePdfUrl] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const scrollContainerRef = useRef(null);
  const currentPageRef = useRef(1);
  const isZoomingRef = useRef(false);

  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  // Kích thước mặc định tự co giãn theo zoomScale cho các trang chưa cuộn tới
  const defaultPageSize = useMemo(() => ({
    width: Math.round(basePageSize.width * zoomScale),
    height: Math.round(basePageSize.height * zoomScale),
  }), [basePageSize, zoomScale]);

  // Xử lý zoom mà không bị nhảy hay reset trang đọc
  const handleZoom = (newScaleOrFn) => {
    isZoomingRef.current = true;
    const pageToAnchor = currentPageRef.current || 1;

    setZoomScale((prev) => {
      const next = typeof newScaleOrFn === 'function' ? newScaleOrFn(prev) : newScaleOrFn;
      return Math.min(2.5, Math.max(0.6, Number(next.toFixed(2))));
    });

    // Cuộn giữ nguyên trang đang đọc khi kích thước trang thay đổi
    setTimeout(() => {
      const pageEl = document.getElementById(`pdf-page-${pageToAnchor}`);
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      setTimeout(() => {
        isZoomingRef.current = false;
      }, 150);
    }, 60);
  };

  const handlePageVisible = useCallback((pageNum) => {
    if (isZoomingRef.current) return;
    setCurrentPage(pageNum);
  }, []);

  // Lấy thông tin sách từ API
  useEffect(() => {
    api.get(`/documents/${id}`)
      .then((res) => {
        const bookData = res.data;
        setBook(bookData);

        const rawPdfUrl = (bookData?.pdfUrl || '').trim();

        if (rawPdfUrl.startsWith('http')) {
          if (rawPdfUrl.includes('drive.google.com')) {
            // Chuyển đổi thành liên kết preview của Google Drive để nhúng đọc trực tiếp
            let previewUrl = rawPdfUrl;
            if (!previewUrl.includes('/preview')) {
              const matchFileD = previewUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
              if (matchFileD && matchFileD[1]) {
                previewUrl = `https://drive.google.com/file/d/${matchFileD[1]}/preview`;
              } else {
                const matchId = previewUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                if (matchId && matchId[1]) {
                  previewUrl = `https://drive.google.com/file/d/${matchId[1]}/preview`;
                }
              }
            }
            setDrivePreviewUrl(previewUrl);
            setActivePdfUrl(null);
            setLoading(false);
          } else {
            // File PDF trực tiếp (Cloudflare R2, CDN,...)
            setDrivePreviewUrl(null);
            setActivePdfUrl(rawPdfUrl);
          }
        } else {
          setDrivePreviewUrl(null);
          setActivePdfUrl(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Lỗi tải thông tin sách:", err);
        setLoading(false);
      });
  }, [id]);

  // Tải file PDF từ Cloudflare R2 với Stream Range Requests và đo tiến độ tải
  useEffect(() => {
    if (!activePdfUrl) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setDownloadProgress(null);

    const loadDocument = async () => {
      try {
        // Tối ưu hóa: Bật disableAutoFetch và disableStream để đọc nhanh từng byte phân đoạn
        const loadingTask = pdfjsLib.getDocument({
          url: activePdfUrl,
          disableAutoFetch: true, // Không tải trước toàn bộ 13MB mà tải theo từng trang khi xem
          disableStream: false,   // Bật stream phân đoạn HTTP Range
          cMapUrl: 'https://unpkg.com/pdfjs-dist@4.3.136/cmaps/',
          cMapPacked: true,
        });

        // Theo dõi tiến độ tải file theo thời gian thực
        loadingTask.onProgress = ({ loaded, total }) => {
          if (isMounted && total > 0) {
            const percent = Math.min(100, Math.round((loaded / total) * 100));
            const loadedMb = (loaded / (1024 * 1024)).toFixed(1);
            const totalMb = (total / (1024 * 1024)).toFixed(1);
            setDownloadProgress({ percent, loadedMb, totalMb });
          }
        };

        const doc = await loadingTask.promise;

        if (isMounted) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setCurrentPage(1);

          // Lấy kích thước chuẩn (scale 1) của Trang 1
          try {
            const firstPage = await doc.getPage(1);
            const vp = firstPage.getViewport({ scale: 1 });
            setBasePageSize({ width: vp.width, height: vp.height });
          } catch (e) {
            console.warn("Không thể đo trang đầu:", e);
          }

          setLoading(false);
        }
      } catch (err) {
        console.warn("Direct fetch gặp lỗi, thử qua proxy:", err);
        try {
          const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(activePdfUrl)}`;
          const loadingTask = pdfjsLib.getDocument({
            url: proxyUrl,
            disableAutoFetch: true,
            disableStream: false,
            cMapUrl: 'https://unpkg.com/pdfjs-dist@4.3.136/cmaps/',
            cMapPacked: true,
          });

          const doc = await loadingTask.promise;
          if (isMounted) {
            setPdfDoc(doc);
            setTotalPages(doc.numPages);
            setCurrentPage(1);

            const firstPage = await doc.getPage(1);
            const vp = firstPage.getViewport({ scale: 1 });
            setBasePageSize({ width: vp.width, height: vp.height });

            setLoading(false);
          }
        } catch (proxyErr) {
          console.error("Không thể load file PDF:", proxyErr);
          if (isMounted) setLoading(false);
        }
      }
    };

    loadDocument();
    return () => { isMounted = false; };
  }, [activePdfUrl]);

  // Theo dõi vị trí cuộn để tính % đọc sách
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const progress = Math.min(100, Math.max(0, (scrollTop / (scrollHeight - clientHeight)) * 100));
    setScrollProgress(progress);
  };

  // Nhảy đến 1 trang cụ thể
  const scrollToPage = (pageNum) => {
    const target = document.getElementById(`pdf-page-${pageNum}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentPage(pageNum);
    }
  };

  // Chế độ toàn màn hình
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Bộ lọc màu sắc cho trang sách & giao diện
  const getThemeStyles = () => {
    switch (theme) {
      case 'dark':
        return {
          roomBg: 'bg-[#0f0f12]',
          patternOpacity: 'opacity-10', // Trống đồng hiện mờ huyền ảo trên nền đen
          topBar: 'bg-[#18181d]/85 text-stone-200 border-b border-white/10 backdrop-blur-xl',
          sidebarBg: 'bg-[#16161b] border-r border-white/10 text-stone-300',
          title: 'text-stone-200 bg-white/10 border-white/15',
          pageFilter: 'none', // SÁCH GIỮ NGUYÊN MÀU TRẮNG SÁNG TỰ NHIÊN ĐỂ RÕ CHỮ
          bookShadow: 'shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)]',
          textColor: 'text-stone-300',
          dockBg: 'bg-[#1c1c22]/95 border-white/10 text-stone-200',
        };
      case 'sepia':
        return {
          roomBg: 'bg-[#f4ecd8]',
          patternOpacity: 'opacity-30', // Trống đồng ấm áp tone sepia
          topBar: 'bg-[#ece2cc]/90 text-amber-950 border-b border-amber-900/20 backdrop-blur-xl',
          sidebarBg: 'bg-[#eee3ce] border-r border-amber-900/20 text-amber-900',
          title: 'text-amber-900 bg-amber-950/10 border-amber-800/20',
          pageFilter: 'sepia(0.22) contrast(0.98)',
          bookShadow: 'shadow-[0_15px_40px_rgba(70,40,15,0.18)]',
          textColor: 'text-amber-900',
          dockBg: 'bg-[#3b2e22]/95 border-amber-800/30 text-amber-100',
        };
      default: // light
        return {
          roomBg: 'bg-[#fcf9f2]',
          patternOpacity: 'opacity-35', // Trống đồng sắc nét, trang nghiêm trên nền sáng
          topBar: 'bg-white/85 text-stone-800 border-b border-stone-200/80 backdrop-blur-xl',
          sidebarBg: 'bg-[#faf5eb] border-r border-stone-200 text-stone-700',
          title: 'text-stone-800 bg-black/5 border-black/5',
          pageFilter: 'none',
          bookShadow: 'shadow-[0_15px_35px_rgba(0,0,0,0.15),0_5px_15px_rgba(0,0,0,0.08)]',
          textColor: 'text-stone-700',
          dockBg: 'bg-stone-900/90 border-white/10 text-white',
        };
    }
  };

  const currentTheme = getThemeStyles();

  if (!book) {
    return (
      <div className="min-h-screen bg-[#141416] flex flex-col items-center justify-center text-stone-300 font-['Lora',serif]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600 mb-3"></div>
        <p className="italic text-sm">Đang mở phòng đọc tư liệu...</p>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col select-none relative overflow-hidden transition-colors duration-500 ${currentTheme.roomBg}`}>
      
      {/* NỀN HOA VĂN TRỐNG ĐỒNG CỔ TRUYỀN (GIỮ NGUYÊN VÀ HOÀN HẢO THEO CHỦ ĐỀ) */}
      <div
        className={`fixed inset-0 z-0 bg-cover bg-center transition-opacity duration-500 pointer-events-none ${currentTheme.patternOpacity}`}
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      ></div>

      {/* THANH ĐIỀU HƯỚNG TRÊN CÙNG (STICKY TOPBAR) */}
      <header className={`w-full z-40 px-3 md:px-6 py-2.5 flex items-center justify-between gap-3 shadow-xs shrink-0 ${currentTheme.topBar}`}>
        
        {/* Cụm nút bên trái */}
        <div className="flex items-center gap-2">
          {/* Nút Quay lại */}
          <button
            onClick={() => navigate(-1)}
            className="font-medium text-xs md:text-sm py-2 px-3.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline font-sans">Quay lại</span>
          </button>

          {/* Nút bật/tắt Sidebar mục lục thumbnail */}
          {activePdfUrl && !loading && totalPages > 0 && (
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                showSidebar ? 'bg-red-700 text-white shadow-xs' : 'hover:bg-black/5 dark:hover:bg-white/10'
              }`}
              title="Mục lục các trang"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
          )}
        </div>

        {/* Tên sách ở giữa trang trọng */}
        <div className="flex flex-col items-center max-w-[40%] sm:max-w-[55%] min-w-0">
          <h1
            title={book.title}
            className={`font-['Lora',serif] font-bold text-xs sm:text-sm md:text-base px-4 py-1.5 rounded-full border truncate text-center shadow-xs ${currentTheme.title}`}
          >
            {book.title}
          </h1>
        </div>

        {/* Cụm công cụ bên phải */}
        <div className="flex items-center gap-1.5 md:gap-2">
          
          {/* Bộ đếm & Nhảy trang nhanh */}
          {activePdfUrl && !loading && totalPages > 0 && (
            <div className="hidden sm:flex items-center gap-1 text-xs font-mono font-medium px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10">
              <span>Trang</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const p = parseInt(e.target.value, 10);
                  if (p >= 1 && p <= totalPages) {
                    scrollToPage(p);
                  }
                }}
                className="w-10 text-center bg-transparent font-bold outline-none border-b border-stone-400 focus:border-red-600"
              />
              <span>/ {totalPages}</span>
            </div>
          )}

          {/* Thu phóng (Zoom) */}
          {activePdfUrl && !loading && (
            <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-full bg-black/5 dark:bg-white/10 text-xs font-mono">
              <button
                onClick={() => handleZoom((s) => s - 0.15)}
                className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full cursor-pointer"
                title="Thu nhỏ"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <button
                onClick={() => handleZoom(1.15)}
                className="px-1.5 hover:underline cursor-pointer"
                title="Đặt lại 100%"
              >
                {Math.round(zoomScale * 100)}%
              </button>
              <button
                onClick={() => handleZoom((s) => s + 0.15)}
                className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full cursor-pointer"
                title="Phóng to"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          )}

          {/* Chọn tông màu bảo vệ mắt */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 transition-all cursor-pointer"
              title="Đổi màu nền bảo vệ mắt"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </button>

            {showSettings && (
              <div className="absolute top-full right-0 mt-2 w-52 rounded-2xl shadow-2xl overflow-hidden font-sans border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 z-[60]">
                <div className="px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 dark:border-stone-800">
                  Tông màu phòng đọc
                </div>
                <button
                  onClick={() => { setTheme('light'); setShowSettings(false); }}
                  className={`w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 text-xs transition-colors cursor-pointer ${
                    theme === 'light' ? 'bg-red-50 text-red-700 font-bold' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-[#fcf9f2] border border-stone-300 shadow-xs"></div> Mặc định (Sáng ấm)
                </button>
                <button
                  onClick={() => { setTheme('sepia'); setShowSettings(false); }}
                  className={`w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 text-xs transition-colors cursor-pointer ${
                    theme === 'sepia' ? 'bg-amber-50 text-amber-800 font-bold' : 'text-stone-700 dark:text-stone-300 hover:bg-amber-50/50 dark:hover:bg-stone-800'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-[#f4ecd8] border border-[#c4b595] shadow-xs"></div> Giấy cổ (Sepia)
                </button>
                <button
                  onClick={() => { setTheme('dark'); setShowSettings(false); }}
                  className={`w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 text-xs transition-colors cursor-pointer ${
                    theme === 'dark' ? 'bg-stone-800 text-white font-bold' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-[#0f0f12] border border-stone-600 shadow-xs"></div> Ban đêm (Tối phòng đọc)
                </button>
              </div>
            )}
          </div>

          {/* Nút Toàn màn hình */}
          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 transition-all cursor-pointer"
            title="Toàn màn hình"
          >
            {isFullscreen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>

          {/* Nút tải về PDF / Mở tab mới */}
          {activePdfUrl && (
            <a
              href={activePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-stone-800 hover:bg-black text-white text-xs font-medium shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Tải file</span>
            </a>
          )}

          {drivePreviewUrl && (
            <a
              href={book?.pdfUrl ? book.pdfUrl.trim() : drivePreviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-red-700 hover:bg-red-800 text-white text-xs font-medium shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Mở tab mới</span>
            </a>
          )}
        </div>
      </header>

      {/* THANH TIẾN ĐỘ ĐỌC MỎNG TRÊN ĐỈNH */}
      {activePdfUrl && (
        <div className="w-full h-1 bg-black/5 dark:bg-white/5 shrink-0 z-30">
          <div
            className="h-full bg-red-600 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>
      )}

      {/* THÂN PHÒNG ĐỌC: SIDEBAR + VÙNG CUỘN PDF */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        
        {/* SIDEBAR DANH SÁCH TRANG THU NHỎ (THUMBNAILS) */}
        {showSidebar && activePdfUrl && !loading && totalPages > 0 && (
          <aside className={`w-56 md:w-64 h-full overflow-y-auto p-3 shrink-0 transition-all shadow-xl z-20 ${currentTheme.sidebarBg}`}>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 px-1">
              Mục lục ({totalPages} trang)
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => scrollToPage(p)}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                    currentPage === p
                      ? 'border-red-600 bg-red-50 dark:bg-red-950/40 font-bold text-red-700 dark:text-red-400 shadow-xs'
                      : 'border-stone-200 dark:border-stone-700/50 hover:bg-black/5 dark:hover:bg-white/5 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <div className="w-full aspect-[3/4] bg-stone-100 dark:bg-stone-800 rounded mb-1 flex items-center justify-center text-[10px] text-stone-400 font-mono">
                    P.{p}
                  </div>
                  <span className="text-[11px] font-mono">Trang {p}</span>
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* VÙNG CUỘN TRANG PDF CHÍNH */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 h-full overflow-y-auto overflow-x-hidden flex flex-col items-center py-4 sm:py-6 px-2 md:px-6 relative scroll-smooth"
        >
          {/* TRƯỜNG HỢP 1: TÀI LIỆU GOOGLE DRIVE ĐƯỢC EMBED ĐỌC TRỰC TIẾP */}
          {drivePreviewUrl && (
            <div className="w-full h-full flex flex-col max-w-6xl mx-auto flex-1 min-h-[550px] p-1 sm:p-3">
              <iframe
                src={drivePreviewUrl}
                title={book.title}
                className="w-full h-full flex-1 rounded-2xl shadow-xl border border-stone-200/80 dark:border-stone-800 bg-white min-h-[78vh]"
                allow="autoplay"
                allowFullScreen
              />
            </div>
          )}

          {/* TRƯỜNG HỢP 2: CHƯA CÓ LIÊN KẾT ĐỌC TRỰC TUYẾN (DƯỚI GÓC NHÌN NGƯỜI DÙNG) */}
          {!activePdfUrl && !drivePreviewUrl && (
            <div className="my-auto max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-stone-900/95 shadow-2xl border border-stone-200/80 dark:border-stone-800 text-center backdrop-blur-xl font-sans">
              {book.coverImageUrl ? (
                <div className="w-24 sm:w-28 aspect-[2/3] rounded-xl overflow-hidden shadow-lg mx-auto mb-5 border border-stone-200/80 bg-stone-100">
                  <img
                    src={book.coverImageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover select-none"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/anh-bac-Ho.jpg";
                    }}
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-stone-800 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              )}

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 mb-3 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Tài liệu đang được số hóa
              </div>

              <h2 className="font-['Lora',serif] font-bold text-lg sm:text-xl text-stone-800 dark:text-stone-100 mb-2 leading-snug">
                {book.title}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 font-sans">
                Tác giả: <strong className="text-stone-700 dark:text-stone-300">{book.author || "Hồ Chí Minh"}</strong>
              </p>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mb-8 leading-relaxed font-['Lora',serif] italic bg-stone-50/80 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-800">
                "Tác phẩm hiện đang trong quá trình số hóa tài liệu trực tuyến để mang lại trải nghiệm đọc tốt nhất cho bạn đọc. Quý độc giả vui lòng quay lại sau hoặc đón đọc các tác phẩm khác trong thư viện."
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 font-sans">
                <button
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer shadow-2xs"
                >
                  ← Quay lại
                </button>
                <button
                  onClick={() => navigate('/category/book')}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Khám phá tủ sách tư liệu →
                </button>
              </div>
            </div>
          )}

          {/* TRƯỜNG HỢP 2: ĐANG TẢI FILE TỪ CLOUDFLARE R2 VỚI THANH TIẾN ĐỘ THỰC */}
          {activePdfUrl && loading && (
            <div className="my-auto flex flex-col items-center justify-center gap-4 max-w-sm w-full px-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-stone-300 border-t-red-700"></div>
              <div>
                <p className={`font-['Lora',serif] font-bold text-sm md:text-base ${currentTheme.textColor} mb-1`}>
                  Đang mở tư liệu từ Cloudflare R2...
                </p>
                {downloadProgress ? (
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                    Đã tải {downloadProgress.loadedMb} MB / {downloadProgress.totalMb} MB ({downloadProgress.percent}%)
                  </p>
                ) : (
                  <p className="text-xs text-stone-400 font-mono">
                    Đang thiết lập kết nối phân đoạn...
                  </p>
                )}
              </div>
              {downloadProgress && (
                <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-red-600 h-full rounded-full transition-all duration-200"
                    style={{ width: `${downloadProgress.percent}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}

          {/* TRƯỜNG HỢP 3: DANH SÁCH CÁC TRANG PDF CUỘN DỌC LIÊN TỤC */}
          {activePdfUrl && !loading && pdfDoc && totalPages > 0 && (
            <div className="w-full flex flex-col items-center pb-24">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <PdfPageItem
                  key={pageNum}
                  pageNumber={pageNum}
                  pdfDoc={pdfDoc}
                  zoomScale={zoomScale}
                  defaultPageSize={defaultPageSize}
                  pageFilter={currentTheme.pageFilter}
                  bookShadow={currentTheme.bookShadow}
                  onVisible={handlePageVisible}
                  theme={theme}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* THANH DOCK ĐIỀU HƯỚNG NỔI (FLOATING DOCK Ở ĐÁY) */}
      {activePdfUrl && !loading && totalPages > 0 && (
        <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 rounded-full shadow-2xl backdrop-blur-xl border transition-all ${currentTheme.dockBg} text-xs font-mono`}>
          
          {/* Nút Cuộn lên đầu trang */}
          <button
            onClick={() => scrollToPage(1)}
            disabled={currentPage <= 1}
            className="p-1.5 hover:bg-white/20 rounded-full disabled:opacity-30 cursor-pointer transition-colors"
            title="Đầu trang"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
            </svg>
          </button>

          {/* Trang trước */}
          <button
            onClick={() => scrollToPage(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1.5 hover:bg-white/20 rounded-full disabled:opacity-30 cursor-pointer transition-colors"
            title="Trang trước"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Vị trí trang hiện tại */}
          <span className="font-bold px-1">
            {currentPage} / {totalPages}
          </span>

          {/* Trang sau */}
          <button
            onClick={() => scrollToPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-1.5 hover:bg-white/20 rounded-full disabled:opacity-30 cursor-pointer transition-colors"
            title="Trang sau"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cuộn xuống cuối trang */}
          <button
            onClick={() => scrollToPage(totalPages)}
            disabled={currentPage >= totalPages}
            className="p-1.5 hover:bg-white/20 rounded-full disabled:opacity-30 cursor-pointer transition-colors"
            title="Cuối trang"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
            </svg>
          </button>

          <div className="w-px h-3.5 bg-white/20 mx-0.5"></div>

          {/* % Đọc */}
          <span className="text-[11px] opacity-70">
            {Math.round(scrollProgress)}%
          </span>

        </div>
      )}

    </div>
  );
}

export default ReaderPage;