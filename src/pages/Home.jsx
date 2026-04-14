import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

// 1. COMPONENT CARD SÁCH - TỐI ƯU HIỂN THỊ ĐỀU NHAU
const BookCard = ({ doc, navigate }) => {
  const [imgError, setImgError] = useState(false);
  const hasValidImageURL = doc.coverImageUrl && doc.coverImageUrl.trim() !== "" && doc.coverImageUrl !== "null";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/book/${doc.id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 group cursor-pointer overflow-hidden w-full"
    >
      <div className="relative w-full aspect-[2/3] bg-gray-100 overflow-hidden shrink-0 border-b border-gray-100">
        {hasValidImageURL && !imgError ? (
          <img
            src={doc.coverImageUrl}
            alt={doc.title}
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

function Home() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/documents?page=0&size=50')
      .then((response) => {
        setDocuments(response.data.content);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi API:", error);
        setLoading(false);
      });
  }, []);

  // GIỮ NGUYÊN LOGIC CŨ CỦA KHẢI
  const booksByHoChiMinh = documents.slice(0, Math.ceil(documents.length / 2));
  const booksAboutHoChiMinh = documents.slice(Math.ceil(documents.length / 2));

  // 🌟 CODE THÊM MỚI: Lọc riêng các bài báo dựa vào cột category 🌟
  const articles = documents.filter(doc => doc.category === 'BaiBao');

  // Variants cho hiệu ứng xuất hiện
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
    <div className="bg-[#fdfbf2] min-h-screen pb-10">

      {/* HERO BANNER - TỐI ƯU MÀU SẮC GỐC & NỔI KHỐI (Giữ nguyên của Khải) */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative bg-cover bg-center bg-no-repeat py-20 md:py-32 shadow-2xl overflow-hidden flex items-center justify-center"
        style={{ backgroundImage: `url(${MyBackgroundImage})` }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"
        ></motion.div>

        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute left-0 bottom-0 h-full z-20 select-none pointer-events-none filter drop-shadow-[10px_0_15px_rgba(0,0,0,0.3)]"
        >
          <img src={BackgroundAssembly} alt="Bác Hồ" className="h-full w-auto object-contain object-left-bottom" />
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          className="absolute right-[-5px] bottom-[-5px] w-48 md:w-80 lg:w-[450px] z-20 select-none pointer-events-none filter drop-shadow-[-10px_0_15px_rgba(0,0,0,0.3)]"
        >
          <img src={YellowStar} alt="Hoa sen" className="w-full h-auto object-contain" />
        </motion.div>

        <div className="relative z-30 max-w-5xl mx-auto text-center px-4">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 uppercase tracking-tight text-yellow-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] leading-tight pb-3"
          >
            Không gian văn hoá <br className="hidden md:block" />
            Hồ Chí Minh
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-xl italic text-white font-medium tracking-widest drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)]"
          >
            "Yêu Bác lòng ta trong sáng hơn !"
          </motion.p>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
      </motion.div>

      <main className="max-w-7xl mx-auto px-4 py-16 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700"></div>
          </div>
        ) : (
          <>
            {/* === PHẦN 1: TÁC PHẨM CỦA HỒ CHÍ MINH === (Giữ nguyên) */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-20"
            >
              <div className="flex flex-col items-center justify-center mb-10">
                <h3 className="text-red-700 font-bold uppercase text-xs md:text-sm tracking-[0.3em] mb-2">Tác phẩm của</h3>
                <h2 className="text-3xl md:text-4xl font-black text-center text-red-800 uppercase tracking-tight">
                  Hồ Chí Minh
                </h2>
                <div className="h-1 w-20 bg-red-600 mt-4 rounded-full"></div>
              </div>

              <div className="px-2 md:px-10 relative">
                <Swiper
                  style={{ '--swiper-navigation-color': '#b91c1c', '--swiper-pagination-color': '#b91c1c', '--swiper-navigation-size': '24px' }}
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={20}
                  slidesPerView={2}
                  navigation
                  pagination={{ clickable: true, dynamicBullets: true }}
                  autoplay={{ delay: 3500, disableOnInteraction: false }}
                  breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 5 } }}
                  className="pb-12 pt-4 px-2"
                >
                  {booksByHoChiMinh.map((doc) => (
                    <SwiperSlide key={doc.id} className="!h-auto flex">
                      <BookCard doc={doc} navigate={navigate} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="flex justify-center mt-6">
                <button onClick={() => navigate('/category/cua-ho-chi-minh')} className="group flex items-center gap-2 border-2 border-red-700 text-red-700 font-bold px-8 py-2.5 rounded-full hover:bg-red-700 hover:text-white transition-all duration-300 shadow-sm">
                  Xem tất cả
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </motion.section>

            <div className="w-full flex justify-center my-16 opacity-20">
              <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-red-800 to-transparent"></div>
            </div>

            {/* === PHẦN 2: TÁC PHẨM VỀ HỒ CHÍ MINH === (Giữ nguyên) */}
            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-col items-center justify-center mb-10">
                <h3 className="text-red-700 font-bold uppercase text-xs md:text-sm tracking-[0.3em] mb-2">Tác phẩm về</h3>
                <h2 className="text-3xl md:text-4xl font-black text-center text-red-800 uppercase tracking-tight">
                  Hồ Chí Minh
                </h2>
                <div className="h-1 w-20 bg-red-600 mt-4 rounded-full"></div>
              </div>

              <div className="px-2 md:px-10 relative">
                <Swiper
                  style={{ '--swiper-navigation-color': '#b91c1c', '--swiper-pagination-color': '#b91c1c', '--swiper-navigation-size': '24px' }}
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={20}
                  slidesPerView={2}
                  navigation
                  pagination={{ clickable: true, dynamicBullets: true }}
                  autoplay={{ delay: 4000, disableOnInteraction: false, reverseDirection: true }}
                  breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 5 } }}
                  className="pb-12 pt-4 px-2"
                >
                  {booksAboutHoChiMinh.map((doc) => (
                    <SwiperSlide key={`about-${doc.id}`} className="!h-auto flex">
                      <BookCard doc={doc} navigate={navigate} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="flex justify-center mt-6">
                <button onClick={() => navigate('/category/ve-ho-chi-minh')} className="group flex items-center gap-2 border-2 border-red-700 text-red-700 font-bold px-8 py-2.5 rounded-full hover:bg-red-700 hover:text-white transition-all duration-300 shadow-sm">
                  Xem tất cả
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </motion.section>

            {/* 🌟 ĐÂY LÀ PHẦN THÊM MỚI: BÀI BÁO (GIỮ ĐÚNG FORMAT CỦA BẠN) 🌟 */}

            <div className="w-full flex justify-center my-16 opacity-20">
              <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-red-800 to-transparent"></div>
            </div>

            <motion.section
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-col items-center justify-center mb-10">
                <h3 className="text-red-700 font-bold uppercase text-xs md:text-sm tracking-[0.3em] mb-2">Những bài báo của</h3>
                <h2 className="text-3xl md:text-4xl font-black text-center text-red-800 uppercase tracking-tight">
                  Hồ Chí Minh
                </h2>
                <div className="h-1 w-20 bg-red-600 mt-4 rounded-full"></div>
              </div>

              <div className="px-2 md:px-10 relative">
                <Swiper
                  style={{ '--swiper-navigation-color': '#b91c1c', '--swiper-pagination-color': '#b91c1c', '--swiper-navigation-size': '24px' }}
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={20}
                  slidesPerView={2}
                  navigation
                  pagination={{ clickable: true, dynamicBullets: true }}
                  autoplay={{ delay: 4500, disableOnInteraction: false }}
                  breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 4 }, 1280: { slidesPerView: 5 } }}
                  className="pb-12 pt-4 px-2"
                >
                  {articles.map((doc) => (
                    <SwiperSlide key={`article-${doc.id}`} className="!h-auto flex">
                      <BookCard doc={doc} navigate={navigate} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="flex justify-center mt-6">
                <button onClick={() => navigate('/category/bai-bao')} className="group flex items-center gap-2 border-2 border-red-700 text-red-700 font-bold px-8 py-2.5 rounded-full hover:bg-red-700 hover:text-white transition-all duration-300 shadow-sm">
                  Xem tất cả
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </motion.section>
          </>
        )}

      </main>
    </div>
  );
}

export default Home;