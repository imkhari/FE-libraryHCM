import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';

import BackgroundAssembly from '../assets/hh.png';
import YellowStar from '../assets/jj.png';
import MyBackgroundImage from '../assets/bg4.jpeg';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// 1. COMPONENT CARD SÁCH - TỐI ƯU HIỂN THỊ ĐỀU NHAU VÀ LAZY LOAD
const BookCard = ({ doc, navigate }) => {
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
            <span className="text-red-800 text-[9px] font-bold uppercase tracking-widest mb-1 opacity-80">{doc.author || "Tác giả"}</span>
            <span className="text-red-900 font-serif font-bold text-sm md:text-base leading-tight line-clamp-4">{doc.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center">
          <span className="bg-red-700 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">Đọc ngay</span>
        </div>
      </div>

      <div className="p-3 flex-1 flex flex-col bg-white">
        <h3 className="text-[13px] md:text-[14px] font-bold text-gray-800 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
          {doc.title}
        </h3>
        <div className="mt-auto pt-2">
          <p className="text-[11px] text-gray-500 font-medium line-clamp-1 italic">
            {doc.author || 'Đang cập nhật'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// 2. COMPONENT KHUNG XƯƠNG (SKELETON)
const BookCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm flex flex-col h-full border border-gray-100 overflow-hidden w-full animate-pulse">
      {/* Khung ảnh bìa giả - Giữ đúng tỷ lệ aspect-[2/3] */}
      <div className="relative w-full aspect-[2/3] bg-gray-200 shrink-0 border-b border-gray-100"></div>

      {/* Khung nội dung (Tiêu đề, Tác giả) giả */}
      <div className="p-3 flex-1 flex flex-col gap-2">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        <div className="mt-auto pt-3">
          <div className="h-3 bg-gray-100 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-100 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

function Home() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [location.pathname]);

  useEffect(() => {
    const cachedData = sessionStorage.getItem('homeDocsCache');

    if (cachedData) {
      setDocuments(JSON.parse(cachedData));
      setLoading(false);
    } else {
      setLoading(true);
    }

    api.get('/documents?page=0&size=50')
      .then((response) => {
        const newData = response.data.content || response.data;
        if (JSON.stringify(newData) !== cachedData) {
          sessionStorage.setItem('homeDocsCache', JSON.stringify(newData));
          setDocuments(newData);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
        if (!cachedData) setLoading(false);
      }, 3000);
  }, []);

  const articles = documents.filter(doc => doc.readType === 'HTML' || doc.read_type === 'HTML');
  const books = documents.filter(doc => doc.readType !== 'HTML' && doc.read_type !== 'HTML');
  const booksByHoChiMinh = books.slice(0, Math.ceil(books.length / 2));
  const booksAboutHoChiMinh = books.slice(Math.ceil(books.length / 2));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="bg-[#fdfbf2] min-h-screen flex flex-col">

      {/* HERO BANNER - Đã đổi Font trang trọng và neo vị trí chống đè ảnh */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        // Đổi justify-center thành justify-start để neo khối chữ lên nửa trên của Banner
        className="relative bg-cover bg-[85%_center] md:bg-center bg-no-repeat pt-6 pb-12 md:pb-0 shadow-2xl overflow-hidden flex flex-col items-center justify-start min-h-[55vh] md:min-h-[60vh] lg:min-h-[65vh]"
        style={{ backgroundImage: `url(${MyBackgroundImage})` }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"
        ></motion.div>

        {/* KHỐI CHỮ: Vẫn nằm Center, nhưng dùng pt-16 md:pt-20 để canh cách mép trên một khoảng cố định */}
        <div className="relative z-30 w-full max-w-4xl mx-auto text-center px-4 pt-12 md:pt-20 lg:pt-24 pb-0">
          <motion.h1
            variants={itemVariants}
            // SỬA FONT: Thêm font-serif, tracking-wide, và chỉnh size lg:text-6xl để chữ thon gọn, thanh lịch hơn
            className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-['Lora',_serif] font-black mb-3 md:mb-5 uppercase tracking-wide text-yellow-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] leading-[1.2]"
          >
            Không gian văn hoá <br className="hidden md:block" />
            Hồ Chí Minh
          </motion.h1>
          <motion.p
            variants={itemVariants}
            // SỬA FONT TEXT NHỎ: Thêm font-serif, font-light, tracking-widest để câu quote trông nghệ thuật hơn
            className="text-[14px] sm:text-sm md:text-xl mb-6 font-['Lora',_serif] italic text-white font-light tracking-[0.15em] drop-shadow-[0_5px_10px_rgba(0,0,0,0.9)]"
          >
            "Yêu Bác lòng ta trong sáng hơn!"
          </motion.p>
        </div>

        {/* ẢNH BÁC HỒ: Khóa max-width để ảnh không bao giờ phình quá to, và luôn bám đáy (bottom-0) */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute left-0 bottom-0 h-[45%] sm:h-[55%] md:h-[70%] lg:h-[75%] max-w-[50%] md:max-w-[40%] lg:max-w-[35%] z-20 select-none pointer-events-none filter drop-shadow-[10px_0_15px_rgba(0,0,0,0.3)]"        >
          <img
            src={BackgroundAssembly}
            alt="Bác Hồ"
            className="w-full h-full object-contain object-left-bottom"
          />
        </motion.div>

        {/* ẢNH HOA SEN / NGÔI SAO: Giữ nguyên */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="absolute right-[-5px] bottom-[-5px] w-36 sm:w-56 md:w-80 lg:w-[450px] z-20 select-none pointer-events-none filter drop-shadow-[-10px_0_15px_rgba(0,0,0,0.3)]"
        >
          <img src={YellowStar} alt="Hoa sen" className="w-full h-auto object-contain" />
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none"></div>
      </motion.div>

      {/* NỘI DUNG CHÍNH */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-16 overflow-hidden w-full">
        {loading ? (

          /* HIỆN SKELETON TRONG LÚC ĐỢI API */
          <div className="space-y-16 md:space-y-20 animate-fade-in pt-4">
            {/* Tạo 3 khối danh mục giả lập */}
            {[1, 2, 3].map((sectionIndex) => (
              <section key={`skeleton-section-${sectionIndex}`}>
                {/* Tiêu đề danh mục giả */}
                <div className="flex flex-col items-center justify-center mb-8 md:mb-10">
                  <div className="h-3 w-24 bg-red-100 rounded mb-4 animate-pulse"></div>
                  <div className="h-8 md:h-10 w-64 md:w-96 bg-red-100 rounded animate-pulse"></div>
                  <div className="h-1 w-16 md:w-20 bg-red-200 mt-4 rounded-full animate-pulse"></div>
                </div>

                {/* Lưới sách giả */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 px-0 sm:px-2 md:px-10">
                  {[...Array(5)].map((_, i) => (
                    /* Ẩn bớt card trên mobile để không làm trang quá dài, tạo cảm giác giống Swiper */
                    <div key={`skeleton-card-${i}`} className={i >= 2 ? "hidden sm:block" : ""}>
                      <BookCardSkeleton />
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

        ) : (
          <>
            {booksByHoChiMinh.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-16 md:mb-20"
              >
                <div className="flex flex-col items-center justify-center mb-8 md:mb-10">
                  <h3 className="text-red-700 font-bold uppercase text-xs md:text-sm tracking-[0.3em] mb-2">Tác phẩm của</h3>
                  <h2 className="text-2xl md:text-4xl font-black text-center text-red-800 uppercase tracking-tight">
                    Hồ Chí Minh
                  </h2>
                  <div className="h-1 w-16 md:w-20 bg-red-600 mt-4 rounded-full"></div>
                </div>

                <div className="px-0 sm:px-2 md:px-10 relative">
                  <Swiper
                    style={{ '--swiper-navigation-color': '#b91c1c', '--swiper-pagination-color': '#b91c1c', '--swiper-navigation-size': '20px' }}
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={15}
                    slidesPerView={2}
                    navigation={{ enabled: true, hideOnClick: true }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    autoplay={{ delay: 3500, disableOnInteraction: false }}
                    breakpoints={{ 640: { slidesPerView: 3, spaceBetween: 20 }, 1024: { slidesPerView: 4, spaceBetween: 20 }, 1280: { slidesPerView: 5, spaceBetween: 20 } }}
                    className="pb-10 md:pb-12 pt-4 px-2"
                  >
                    {booksByHoChiMinh.map((doc) => (
                      <SwiperSlide key={doc.id} className="!h-auto flex">
                        <BookCard doc={doc} navigate={navigate} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className="flex justify-center mt-4 md:mt-6">
                  <button
                    onClick={() => { window.scrollTo(0, 0); navigate('/category/cua-ho-chi-minh'); }}
                    className="group flex items-center gap-2 border border-red-700 md:border-2 text-red-700 font-bold px-6 py-2 md:px-8 md:py-2.5 rounded-full hover:bg-red-700 hover:text-white transition-all duration-300 shadow-sm text-sm md:text-base"
                  >
                    Xem tất cả
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              </motion.section>
            )}

            <div className="w-full flex justify-center my-10 md:my-16 opacity-20">
              <div className="w-2/3 md:w-1/2 h-px bg-gradient-to-r from-transparent via-red-800 to-transparent"></div>
            </div>

            {booksAboutHoChiMinh.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-16 md:mb-20"
              >
                <div className="flex flex-col items-center justify-center mb-8 md:mb-10">
                  <h3 className="text-red-700 font-bold uppercase text-xs md:text-sm tracking-[0.3em] mb-2">Tác phẩm về</h3>
                  <h2 className="text-2xl md:text-4xl font-black text-center text-red-800 uppercase tracking-tight">
                    Hồ Chí Minh
                  </h2>
                  <div className="h-1 w-16 md:w-20 bg-red-600 mt-4 rounded-full"></div>
                </div>

                <div className="px-0 sm:px-2 md:px-10 relative">
                  <Swiper
                    style={{ '--swiper-navigation-color': '#b91c1c', '--swiper-pagination-color': '#b91c1c', '--swiper-navigation-size': '20px' }}
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={15}
                    slidesPerView={2}
                    navigation={{ enabled: true, hideOnClick: true }}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    autoplay={{ delay: 4000, disableOnInteraction: false, reverseDirection: true }}
                    breakpoints={{ 640: { slidesPerView: 3, spaceBetween: 20 }, 1024: { slidesPerView: 4, spaceBetween: 20 }, 1280: { slidesPerView: 5, spaceBetween: 20 } }}
                    className="pb-10 md:pb-12 pt-4 px-2"
                  >
                    {booksAboutHoChiMinh.map((doc) => (
                      <SwiperSlide key={`about-${doc.id}`} className="!h-auto flex">
                        <BookCard doc={doc} navigate={navigate} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className="flex justify-center mt-4 md:mt-6">
                  <button
                    onClick={() => { window.scrollTo(0, 0); navigate('/category/ve-ho-chi-minh'); }}
                    className="group flex items-center gap-2 border border-red-700 md:border-2 text-red-700 font-bold px-6 py-2 md:px-8 md:py-2.5 rounded-full hover:bg-red-700 hover:text-white transition-all duration-300 shadow-sm text-sm md:text-base"
                  >
                    Xem tất cả
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </div>
              </motion.section>
            )}

            {articles.length > 0 && (
              <>
                <div className="w-full flex justify-center my-10 md:my-16 opacity-20">
                  <div className="w-2/3 md:w-1/2 h-px bg-gradient-to-r from-transparent via-red-800 to-transparent"></div>
                </div>

                <motion.section
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="flex flex-col items-center justify-center mb-8 md:mb-10">
                    <h3 className="text-red-700 font-bold uppercase text-xs md:text-sm tracking-[0.3em] mb-2">Những bài báo của</h3>
                    <h2 className="text-2xl md:text-4xl font-black text-center text-red-800 uppercase tracking-tight">
                      Hồ Chí Minh
                    </h2>
                    <div className="h-1 w-16 md:w-20 bg-red-600 mt-4 rounded-full"></div>
                  </div>

                  <div className="px-0 sm:px-2 md:px-10 relative">
                    <Swiper
                      style={{ '--swiper-navigation-color': '#b91c1c', '--swiper-pagination-color': '#b91c1c', '--swiper-navigation-size': '20px' }}
                      modules={[Navigation, Pagination, Autoplay]}
                      spaceBetween={15}
                      slidesPerView={2}
                      navigation={{ enabled: true, hideOnClick: true }}
                      pagination={{ clickable: true, dynamicBullets: true }}
                      autoplay={{ delay: 4500, disableOnInteraction: false }}
                      breakpoints={{ 640: { slidesPerView: 3, spaceBetween: 20 }, 1024: { slidesPerView: 4, spaceBetween: 20 }, 1280: { slidesPerView: 5, spaceBetween: 20 } }}
                      className="pb-10 md:pb-12 pt-4 px-2"
                    >
                      {articles.map((doc) => (
                        <SwiperSlide key={`article-${doc.id}`} className="!h-auto flex">
                          <BookCard doc={doc} navigate={navigate} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  <div className="flex justify-center mt-4 md:mt-6">
                    <button
                      onClick={() => { window.scrollTo(0, 0); navigate('/category/bai-bao'); }}
                      className="group flex items-center gap-2 border border-red-700 md:border-2 text-red-700 font-bold px-6 py-2 md:px-8 md:py-2.5 rounded-full hover:bg-red-700 hover:text-white transition-all duration-300 shadow-sm text-sm md:text-base"
                    >
                      Xem tất cả
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                  </div>
                </motion.section>
              </>
            )}

          </>
        )}

      </main>
    </div>
  );
}

export default Home;