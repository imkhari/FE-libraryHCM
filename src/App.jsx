import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import CategoryPage from './pages/CategoryPage';
import ReaderPage from './pages/ReaderPage';
import SearchPage from './pages/SearchPage';
import BioPage from './pages/BioPage';
import IdeologyPage from './pages/IdeologyPage';
import ArticleDetail from './pages/ArticleDetail'; 
import VideoDetailPage from './pages/VideoDetailPage';
import BG2 from './assets/bg2.jpeg';
import FooterImg from './assets/bg1.jpg';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Thêm State để đóng/mở Menu trên Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Tự động đóng menu mobile khi chuyển trang
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Trình duyệt của bạn không hỗ trợ tìm kiếm giọng nói. Hãy thử Chrome hoặc Edge!");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setKeyword(transcript);
      setIsListening(false);
      setTimeout(() => {
        navigate(`/search?q=${transcript}`);
        setIsSearchOpen(false);
      }, 500);
    };
    recognition.onerror = (event) => {
      console.error("Lỗi nhận diện:", event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && keyword.trim() !== "") {
      navigate(`/search?q=${keyword}`);
      setIsSearchOpen(false);
      setKeyword("");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) setShowScrollTop(true);
      else setShowScrollTop(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDateTime = (date) => {
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const dayName = days[date.getDay()];
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${dayName}, ${d}/${m}/${y} - ${hh}:${mm}:${ss}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-red-200 flex flex-col relative">

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          white-space: nowrap;
          animation: marquee 20s linear infinite; 
        }
        .animate-marquee:hover {
          animation-play-state: paused; 
        }
      `}</style>

      {/* SEARCH OVERLAY - Giảm padding và font chữ trên Mobile */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[1000] bg-red-900/95 backdrop-blur-md flex flex-col items-center justify-start pt-24 md:pt-40 px-4 transition-all duration-500">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-6 right-6 md:top-8 md:right-8 text-white/60 hover:text-white hover:rotate-90 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="w-full max-w-3xl flex flex-col items-center">
            <div className="relative w-full group">
              <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <input
                autoFocus
                type="text"
                placeholder={isListening ? "Đang lắng nghe..." : "Tìm kiếm..."}
                className={`w-full bg-white rounded-xl md:rounded-2xl py-4 md:py-5 pl-12 md:pl-14 pr-14 md:pr-16 text-lg md:text-2xl outline-none shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-all duration-300 ${isListening ? 'ring-4 ring-red-400' : 'focus:ring-4 focus:ring-red-400/50'}`}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleSearch}
              />

              <button
                onClick={handleVoiceSearch}
                className={`absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg md:rounded-xl transition-all duration-300 ${isListening ? 'bg-red-600 text-white shadow-lg shadow-red-500/50' : 'text-gray-400 hover:bg-gray-100 hover:text-red-600'}`}
              >
                {isListening ? (
                  <div className="flex gap-1 items-center">
                    <span className="w-1 h-3 md:h-4 bg-white rounded-full animate-bounce"></span>
                    <span className="w-1 h-4 md:h-6 bg-white rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                    <span className="w-1 h-3 md:h-4 bg-white rounded-full animate-bounce [animation-delay:-0.4s]"></span>
                  </div>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOPBAR - Đổi thành flex-col trên điện thoại để chữ không bị tràn ngang */}
      <div className="bg-[#da251d] text-red-100 text-[10px] md:text-[11px] lg:text-[12px] py-1 md:py-1.5 px-2 md:px-4 font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center md:justify-end items-center gap-0 md:gap-0.5 text-center md:text-left">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Sở Giáo dục và Đào tạo thành phố Đà Nẵng
            <span className="mx-2 opacity-50 hidden md:inline">|</span>
          </div>
          <div className="flex items-center mt-0.5 md:mt-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Trường THPT Thái Phiên - Thăng Bình
          </div>
        </div>
      </div>

      {/* BANNER */}
      <div className="relative w-full h-16 md:h-34 lg:h-40 bg-[#fdfbf2] overflow-hidden border-b border-red-200">
        <img src={BG2} alt="Banner" className="w-full h-full object-cover object-left" />
      </div>

      {/* NAVBAR CHÍNH */}
      <header className="bg-[#da251d] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 lg:px-4 h-11 md:h-12 flex justify-between items-center">
          
          {/* 🌟 NÚT MENU MOBILE (Chỉ hiện trên điện thoại) 🌟 */}
          <button 
            className="md:hidden p-1.5 hover:bg-red-800 rounded text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* 🌟 GIAO DIỆN DESKTOP CỦA BẠN (Được bảo tồn 100%, thêm hidden md:flex) 🌟 */}
          <nav className="hidden md:flex items-center h-full overflow-visible whitespace-nowrap">
            <Link to="/" className="h-full px-3 md:px-4 flex items-center hover:bg-red-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </Link>
            <Link to="/bio" className="h-full px-2 md:px-3 flex items-center text-[11px] md:text-[13px] font-bold uppercase hover:bg-red-800 transition-colors">
              Cuộc đời, sự nghiệp
            </Link>
            <div className="relative group h-full">
              <Link to="/ideology" className="h-full px-2 md:px-3 flex items-center text-[11px] md:text-[13px] font-bold uppercase hover:bg-red-800 transition-colors cursor-pointer">
                Tư tưởng, đạo đức
              </Link>
              <div className="absolute left-0 top-full hidden group-hover:block w-[280px] bg-[#fdfbf2] text-gray-800 shadow-2xl border-t-[3px] border-red-700 py-1 z-[999]">
                <Link to="/ideology" className="block px-4 py-2.5 text-[13px] font-medium hover:bg-red-100 hover:text-red-800 border-b border-gray-200/60 transition-colors">Nguồn gốc hình thành</Link>
                <Link to="/ideology" className="block px-4 py-2.5 text-[13px] font-medium hover:bg-red-100 hover:text-red-800 border-b border-gray-200/60 transition-colors">Nội dung tư tưởng, đạo đức</Link>
                <Link to="/ideology" className="block px-4 py-2.5 text-[13px] font-medium hover:bg-red-100 hover:text-red-800 transition-colors">Nghiên cứu tư tưởng, đạo đức Hồ Chí Minh</Link>
              </div>
            </div>

            <div className="relative group h-full">
              <Link to="/" className="h-full px-3 md:px-4 flex items-center text-[11px] md:text-[13px] font-bold uppercase bg-[#b71a14] group-hover:bg-red-800 transition-all cursor-pointer">
                Tủ sách điện tử
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div className="absolute left-0 top-full hidden group-hover:block w-64 bg-white text-gray-800 shadow-2xl border-t-2 border-red-700 py-2 z-[999]">
                <Link to="/category/cua-ho-chi-minh" className="block px-4 py-3 text-[13px] font-medium hover:bg-red-50 hover:text-red-700 border-b border-gray-100">Tác phẩm của Hồ Chí Minh</Link>
                <Link to="/category/ve-ho-chi-minh" className="block px-4 py-3 text-[13px] font-medium hover:bg-red-50 hover:text-red-700 border-b border-gray-100">Tác phẩm về Hồ Chí Minh</Link>
                <Link to="/category/bai-bao" className="block px-4 py-3 text-[13px] font-medium hover:bg-red-50 hover:text-red-700">Những bài báo của Hồ Chí Minh</Link>
              </div>
            </div>

            <a href="#" className="h-full px-2 md:px-3 flex items-center text-[11px] md:text-[13px] font-bold uppercase hover:bg-red-800 transition-colors">Hồ Chí Minh & Thế giới</a>
            <a href="#" className="h-full px-2 md:px-3 flex items-center text-[11px] md:text-[13px] font-bold uppercase hover:bg-red-800 transition-colors">Học tập theo Bác</a>
          </nav>

          <div className="ml-auto md:ml-2 flex items-center shrink-0">
            <button onClick={() => setIsSearchOpen(true)} className="bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* 🌟 DROPDOWN MENU CHO MOBILE 🌟 */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#b71a14] w-full border-t border-red-800 shadow-xl flex flex-col absolute top-full left-0 z-50">
            <Link to="/" className="px-4 py-3 text-sm font-bold uppercase border-b border-red-800/50">Trang chủ</Link>
            <Link to="/bio" className="px-4 py-3 text-sm font-bold uppercase border-b border-red-800/50">Cuộc đời, sự nghiệp</Link>
            <Link to="/ideology" className="px-4 py-3 text-sm font-bold uppercase border-b border-red-800/50">Tư tưởng, đạo đức</Link>
            <Link to="/category/cua-ho-chi-minh" className="px-4 py-3 text-sm font-bold uppercase border-b border-red-800/50">Tác phẩm của Bác</Link>
            <Link to="/category/ve-ho-chi-minh" className="px-4 py-3 text-sm font-bold uppercase border-b border-red-800/50">Tác phẩm về Bác</Link>
            <Link to="/category/bai-bao" className="px-4 py-3 text-sm font-bold uppercase border-b border-red-800/50">Bài báo của Bác</Link>
          </div>
        )}
      </header>

      {/* THANH THỜI GIAN & TICKER TIN TỨC */}
      {location.pathname !== "/" && (
        <div className="bg-[#f2f2f2] border-b border-gray-200 text-[11px] md:text-[13px] text-gray-700 font-medium overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center h-8 md:h-10 px-2 lg:px-4">
            {/* Ẩn đồng hồ trên mobile cho đỡ chật */}
            <div className="hidden md:flex items-center shrink-0 pr-4 border-r border-gray-300 h-full relative z-10 bg-[#f2f2f2]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDateTime(currentTime)}
            </div>

            <div className="flex-1 overflow-hidden ml-1 md:ml-4 relative h-full">
              <div className="absolute top-0 bottom-0 left-0 flex items-center animate-marquee">
                {/* SET 1 */}
                <div className="flex items-center">
                  <span className="flex items-center text-red-700 hover:text-red-900 transition-colors cursor-pointer">
                    Học tập và làm theo Bác ở xã Hiếu Giang
                    <span className="bg-red-600 text-white text-[8px] md:text-[9px] font-black px-1.5 py-0.5 rounded ml-2 shadow-sm animate-pulse">NEW</span>
                  </span>
                  <span className="mx-4 md:mx-8 text-gray-300">|</span>
                  <span className="flex items-center text-red-700 hover:text-red-900 transition-colors cursor-pointer">
                    Chiến sĩ quân y làm theo lời Bác
                  </span>
                  <span className="mx-4 md:mx-8 text-gray-300">|</span>
                  <span className="flex items-center text-red-700 hover:text-red-900 transition-colors cursor-pointer">
                    Lan tỏa những cách làm hay
                  </span>
                  <span className="mx-4 md:mx-8 text-gray-300">|</span>
                </div>
                {/* SET 2 */}
                <div className="flex items-center">
                  <span className="flex items-center text-red-700 hover:text-red-900 transition-colors cursor-pointer">
                    Học tập và làm theo Bác ở xã Hiếu Giang
                    <span className="bg-red-600 text-white text-[8px] md:text-[9px] font-black px-1.5 py-0.5 rounded ml-2 shadow-sm animate-pulse">NEW</span>
                  </span>
                  <span className="mx-4 md:mx-8 text-gray-300">|</span>
                  <span className="flex items-center text-red-700 hover:text-red-900 transition-colors cursor-pointer">
                    Chiến sĩ quân y làm theo lời Bác
                  </span>
                  <span className="mx-4 md:mx-8 text-gray-300">|</span>
                  <span className="flex items-center text-red-700 hover:text-red-900 transition-colors cursor-pointer">
                    Lan tỏa những cách làm hay
                  </span>
                  <span className="mx-4 md:mx-8 text-gray-300">|</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NƠI RENDER NỘI DUNG CÁC TRANG */}
      <div className="flex-1">
        <Outlet />
      </div>

      {/* FOOTER */}
      <footer className="relative bg-white border-t-4 border-red-700 pt-8 pb-6 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
          <img src={FooterImg} alt="Hoa văn" className="w-full h-auto mb-100 opacity-100 object-contain select-none" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="mb-6 border-b border-red-100 pb-4 text-center md:text-left">
            <h2 className="text-red-700 font-bold text-lg md:text-xl uppercase tracking-wider">
              Cơ quan chủ quản: <br className="md:hidden"/><span className="font-black">Trường THPT Thái Phiên - Thăng Bình</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700 text-sm md:text-[15px]">
            <div className="flex items-start gap-3">
              <div className="bg-red-100 p-2 rounded-full shrink-0"><span className="text-red-700 font-bold">©</span></div>
              <p>Bản quyền thuộc về <br /><span className="font-bold text-gray-900">Trường THPT Thái Phiên - Thăng Bình</span></p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-red-100 p-2 rounded-full shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <p><span className="font-bold text-gray-900 uppercase text-[12px] block mb-1">Địa chỉ:</span>Thôn 8 - xã Thăng Bình - TP. Đà Nẵng</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-red-100 p-2 rounded-full shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p><span className="font-bold text-gray-900">Điện thoại:</span> 05103 675 346</p>
                <p><span className="font-bold text-gray-900">Email:</span> trongtantp@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* NÚT CUỘN TRANG - Thu nhỏ padding góc màn hình điện thoại */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 md:bottom-15 md:right-15 z-[1000] p-3 md:p-4 rounded-full bg-red-800 text-white shadow-2xl transition-all duration-500 hover:bg-red-700 hover:-translate-y-2 active:scale-90 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
        title="Cuộn lên đầu trang"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

    </div>
  );
};

// 🌟 APP CHÍNH GỌN GÀNG, CHỈ CHỨA ROUTER 🌟
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/category/:type" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/bio" element={<BioPage />} />
          <Route path="/ideology" element={<IdeologyPage />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/video/:id" element={<VideoDetailPage />} />
        </Route>

        <Route path="/reader/:id" element={<ReaderPage />} />
      </Routes>
    </Router>
  );
}

export default App;