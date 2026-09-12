import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const galleryData = [
  {
    id: 1,
    url: "https://file3.qdnd.vn/data/images/0/2022/09/01/tvkimgiang/bac%20ho%20doc%20tuyen%20ngon.jpg",
    title: "Bác Hồ đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình",
    date: "02/09/1945",
    category: "khangchien"
  },
  {
    id: 2,
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Ho_Chi_Minh_1946.jpg",
    title: "Chân dung Chủ tịch Hồ Chí Minh (1890 - 1969)",
    date: "1946",
    category: "khangchien"
  },
  {
    id: 3,
    url: "https://thinhvuongvietnam.com/Content/UploadFiles/EditorFiles/images/2025/Quy2/bac-ho-voi-thieu-nhi19052025095132.jpg",
    title: "Bác Hồ với các cháu thiếu nhi (Biểu tượng tình thương)",
    date: "1950",
    category: "nhandan"
  },
  {
    id: 4,
    url: "https://bthcm.hue.gov.vn/Portals/0/Medias/Nam2024/T12/15.Toan-Canh-Dai-Hoi-Tour-Phap-1920.jpg",
    title: "Toàn cảnh Đại hội Tours - Đảng Cộng sản Pháp",
    date: "1920",
    category: "cuunuoc"
  },
  {
    id: 5,
    url: "https://img.youtube.com/vi/xjMcJ7yJA8M/hqdefault.jpg",
    title: "Bác Hồ bắt nhịp bài ca Kết đoàn (Đại đoàn kết toàn dân)",
    date: "1960",
    category: "xaydung"
  },
  {
    id: 6,
    url: "https://images.hcmcpv.org.vn/res/news/2021/09/13-09-2021-tam-uoc-viet-phap-nhip-nghi-can-thiet-cho-cach-mang-viet-nam-FEF4008E.PNG",
    title: "Ký Hiệp định Sơ bộ cùng Bộ trưởng Pháp Marius Moutet",
    date: "1946",
    category: "khangchien"
  },
  {
    id: 7,
    url: "https://vcdn1-vnexpress.vnecdn.net/2019/08/31/1-1567219408.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=ThLBSkADzJTe-Bevf0PQYw",
    title: "Chủ tịch Hồ Chí Minh làm việc tại Phủ Chủ tịch",
    date: "1955",
    category: "xaydung"
  },
  {
    id: 8,
    url: "https://img.youtube.com/vi/H4xEN0wMzEo/hqdefault.jpg",
    title: "Bác Hồ lội ruộng cùng nông dân (Gần dân, vì dân)",
    date: "1950s",
    category: "nhandan"
  },
  {
    id: 9,
    url: "https://baotanghochiminh.vn/pic/Customer/images/N%C4%83m%202023/Th%C3%A1ng%209/cb5.jpeg",
    title: "Người quan sát trận địa tại chiến dịch Biên giới",
    date: "1950",
    category: "khangchien"
  },
  {
    id: 10,
    url: "https://media.baocaobang.vn/upload/image/202301/medium/100703_11.jpg",
    title: "Bác Hồ trở về Pác Bó trực tiếp lãnh đạo cách mạng Việt Nam",
    date: "1941",
    category: "cuunuoc"
  },
  {
    id: 11,
    url: "https://cdnmedia.baotintuc.vn/Upload/DMDnZyELa7xUDTdLsa19w/files/2021/05/050521/070521/080521/160521/170521/ho-chi-minh-190521.jpg",
    title: "Hồ Chí Minh - Ngọn cờ dẫn dắt niềm tin cách mạng",
    date: "1960s",
    category: "xaydung"
  },
  {
    id: 12,
    url: "https://data.ihoc.vn/ihoc-bucket/2023/07/cang-nha-rong.jpg",
    title: "Bến cảng Nhà Rồng - Nơi Người ra đi tìm đường cứu nước",
    date: "05/06/1911",
    category: "cuunuoc"
  },
  {
    id: 13,
    url: "https://bna.1cdn.vn/2016/10/02/uploaded-dataimages-201609-original-_images1698661_images6751580003_sox54.jpg",
    title: "Bác Hồ với sự nghiệp giáo dục, khuyến học - khuyến tài",
    date: "1960s",
    category: "nhandan"
  },
  {
    id: 14,
    url: "https://bna.1cdn.vn/2021/12/06/uploaded-daotuanbna-2021_12_06-_nguyen_ai_quoc_7068408_6122021.jpeg",
    title: "Nguyễn Ái Quốc phát biểu tại Đại hội Đảng ở Marseille",
    date: "1921",
    category: "cuunuoc"
  },
  {
    id: 15,
    url: "https://vnmha.mae.gov.vn/noidung/PublishingImage/06_09_2024_01_19_57_1(4).jpg",
    title: "Bác Hồ tập thể dục (Rèn luyện thân thể theo gương Bác)",
    date: "1960",
    category: "xaydung"
  },
  {
    id: 16,
    url: "https://vannghedanang.org.vn/app/upload/post/2022-09-13/thoi-su-van-nghe-10096.jpg",
    title: "Phong thái ung dung của Người trong những năm bôn ba",
    date: "1921",
    category: "cuunuoc"
  },
  {
    id: 17,
    url: "https://bqn.1cdn.vn/2020/08/26/baodanang.vn-dataimages-202008-original-_images1577633_11.jpg",
    title: "Chủ tịch Hồ Chí Minh thăm hỏi đồng bào và chiến sĩ miền Trung",
    date: "1958",
    category: "nhandan"
  },
  {
    id: 18,
    url: "https://media-cdn-v2.laodong.vn/storage/newsportal/2023/9/1/1236241/3-VHTT-1032609-02.jpg",
    title: "Quảng trường Ba Đình - Nơi ghi dấu sự kiện lập quốc",
    date: "02/09/1945",
    category: "khangchien"
  },
  {
    id: 19,
    url: "https://cdn-images.vtv.vn/zoom/700_390/562122370168008704/2023/9/2/photo1693631823563-1693631823877315811306.jpg",
    title: "Ngôi nhà sàn giản dị trong khu di tích Phủ Chủ tịch",
    date: "1958 - 1969",
    category: "xaydung"
  },
  {
    id: 20,
    url: "https://cdn.baophapluat.vn/w3840/uploaded/phanmo/2024_08_30/anh-3-1715.jpg",
    title: "Xúc động những trang báo viết về ngày Bác đi xa",
    date: "04/09/1969",
    category: "xaydung"
  },
  {
    id: 21,
    url: "https://baotanghochiminh.vn/pic/News/images/B%E1%BA%A3o%20t%C3%A0ng%20HCM%20n%C4%83m%202021/Th%C3%A1ng%207/Thumbnails035220160552223--NguyenAiQuoc2.jpg",
    title: "Hành trình Người đi tìm hình của Nước",
    date: "05/06/1911",
    category: "cuunuoc"
  }
];

const categories = [
  { id: 'all', label: 'Tất cả khoảnh khắc' },
  { id: 'cuunuoc', label: 'Bôn ba cứu nước (1911 - 1945)' },
  { id: 'khangchien', label: 'Kháng chiến & Lãnh đạo (1945 - 1954)' },
  { id: 'xaydung', label: 'Xây dựng đất nước (1954 - 1969)' },
  { id: 'nhandan', label: 'Bác Hồ với Nhân dân & Thiếu nhi' }
];

function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredData = activeCategory === 'all'
    ? galleryData
    : galleryData.filter(item => item.category === activeCategory);

  // Điều hướng bằng bàn phím trong Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredData.length - 1));
      }
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev < filteredData.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredData]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredData.length - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev < filteredData.length - 1 ? prev + 1 : 0));
  };

  const currentImg = selectedIndex !== null ? filteredData[selectedIndex] : null;

  return (
    <div className="bg-[#fcf9f2] min-h-screen py-10 md:py-16 font-sans selection:bg-red-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TIÊU ĐỀ TRANG TRANG TRỌNG */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <span className="text-red-700 font-bold uppercase text-xs md:text-sm tracking-[0.3em] mb-2 inline-block">
            Tư liệu lịch sử
          </span>
          <h1 className="text-3xl md:text-5xl font-['Lora',serif] font-black text-red-800 uppercase tracking-tight mb-4">
            Triển lãm Ảnh
          </h1>
          <div className="h-1 w-20 bg-red-700 mx-auto rounded-full mb-4"></div>
          <p className="text-stone-600 max-w-2xl mx-auto italic font-medium font-['Lora',serif] text-sm md:text-base leading-relaxed">
            "Không gian lưu giữ những khoảnh khắc lịch sử vô giá về cuộc đời và sự nghiệp cách mạng vĩ đại của Chủ tịch Hồ Chí Minh."
          </p>
        </motion.div>

        {/* BỘ LỌC CHỦ ĐỀ (CATEGORY TABS) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-xs md:text-sm transition-all duration-300 cursor-pointer font-medium ${
                activeCategory === cat.id
                  ? 'bg-[#da251d] text-white shadow-md font-bold scale-105'
                  : 'bg-white text-stone-600 hover:text-red-700 hover:bg-stone-50 border border-stone-200 shadow-xs'
              }`}
            >
              {cat.label}
              {cat.id === 'all' && (
                <span className="ml-1.5 opacity-70 text-[11px]">({galleryData.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* LƯỚI ẢNH MASONRY */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-5"
        >
          <AnimatePresence>
            {filteredData.map((item, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                key={item.id}
                onClick={() => setSelectedIndex(index)}
                className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 mb-4 md:mb-5 border border-stone-200/80 bg-stone-100"
              >
                {/* Ảnh có fallback an toàn */}
                <img
                  src={item.url}
                  alt={item.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/anh-bac-Ho.jpg";
                  }}
                  className="w-full h-auto block object-cover transform group-hover:scale-105 transition-transform duration-700 select-none"
                />

                {/* Lớp phủ thông tin khi hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 md:p-4 text-left">
                  <span className="bg-amber-400 text-stone-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs w-fit mb-1.5 font-sans">
                    {item.date}
                  </span>
                  <h3 className="text-white font-bold text-xs md:text-sm leading-snug font-['Lora',serif] text-left line-clamp-3 drop-shadow-md">
                    {item.title}
                  </h3>
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-stone-300 font-sans">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                    <span>Nhấn để phóng to</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>

      {/* CỬA SỔ XEM ẢNH NÂNG CAO (LIGHTBOX) CÓ NEXT / PREV */}
      <AnimatePresence>
        {currentImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8 select-none"
          >
            {/* Thanh điều khiển trên cùng */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-50 px-2">
              <span className="text-white/70 text-xs md:text-sm font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs font-mono">
                {selectedIndex + 1} / {filteredData.length}
              </span>

              <button
                className="text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full cursor-pointer"
                onClick={() => setSelectedIndex(null)}
                title="Đóng (Phím Esc)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nút Prev (Xem ảnh trước) */}
            <button
              onClick={handlePrev}
              title="Ảnh trước (Phím mũi tên trái)"
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 hover:bg-black/70 p-3 rounded-full transition-all duration-200 cursor-pointer z-50 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Khung ảnh trung tâm */}
            <div
              className="relative max-w-4xl max-h-[75vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={currentImg.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                src={currentImg.url}
                alt={currentImg.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/anh-bac-Ho.jpg";
                }}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl bg-black/30"
              />
            </div>

            {/* Nút Next (Xem ảnh tiếp theo) */}
            <button
              onClick={handleNext}
              title="Ảnh sau (Phím mũi tên phải)"
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 hover:bg-black/70 p-3 rounded-full transition-all duration-200 cursor-pointer z-50 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Chú thích ảnh phía dưới */}
            <motion.div
              key={`caption-${currentImg.id}`}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="mt-5 text-center max-w-2xl px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg md:text-xl font-bold text-white mb-1.5 font-['Lora',serif]">
                {currentImg.title}
              </h2>
              <span className="inline-block bg-amber-500/80 text-stone-950 font-bold text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans">
                Thời gian: {currentImg.date}
              </span>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GalleryPage;