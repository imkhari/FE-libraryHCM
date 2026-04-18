import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const galleryData = [
  {
    id: 1,
    url: "https://file3.qdnd.vn/data/images/0/2022/09/01/tvkimgiang/bac%20ho%20doc%20tuyen%20ngon.jpg",
    title: "Bác Hồ đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình",
    date: "02/09/1945"
  },
  {
    id: 2,
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1c/Ho_Chi_Minh_1946.jpg",
    title: "Chân dung Chủ tịch Hồ Chí Minh (1890 - 1969)",
    date: "1946"
  },
  {
    id: 3,
    url: "https://thinhvuongvietnam.com/Content/UploadFiles/EditorFiles/images/2025/Quy2/bac-ho-voi-thieu-nhi19052025095132.jpg",
    title: "Bác Hồ với các cháu thiếu nhi (Biểu tượng tình thương)",
    date: "1950"
  },
  {
    id: 4,
    url: "https://bthcm.hue.gov.vn/Portals/0/Medias/Nam2024/T12/15.Toan-Canh-Dai-Hoi-Tour-Phap-1920.jpg",
    title: "Toàn cảnh Đại hội Tours - Đảng Cộng sản Pháp",
    date: "1920"
  },
  {
    id: 5,
    url: "https://img.youtube.com/vi/xjMcJ7yJA8M/hqdefault.jpg",
    title: "Bác Hồ bắt nhịp bài ca Kết đoàn (Đại đoàn kết dân tộc)",
    date: "1960"
  },
  {
    id: 6,
    url: "https://images.hcmcpv.org.vn/res/news/2021/09/13-09-2021-tam-uoc-viet-phap-nhip-nghi-can-thiet-cho-cach-mang-viet-nam-FEF4008E.PNG",
    title: "Ký Hiệp định Sơ bộ cùng Bộ trưởng Pháp Marius Moutet",
    date: "1946"
  },
  {
    id: 7,
    url: "https://vcdn1-vnexpress.vnecdn.net/2019/08/31/1-1567219408.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=ThLBSkADzJTe-Bevf0PQYw",
    title: "Chủ tịch Hồ Chí Minh làm việc tại Phủ Chủ tịch",
    date: "1955"
  },
  {
    id: 8,
    url: "https://img.youtube.com/vi/H4xEN0wMzEo/hqdefault.jpg",
    title: "Bác Hồ lội ruộng cùng nông dân (Gần dân, sát dân)",
    date: "1950s"
  },
  {
    id: 9,
    url: "https://baotanghochiminh.vn/pic/Customer/images/N%C4%83m%202023/Th%C3%A1ng%209/cb5.jpeg",
    title: "Người quan sát trận địa tại chiến dịch Biên giới",
    date: "1950"
  },
  {
    id: 10,
    url: "https://img.youtube.com/vi/34GKvR8nZus/hqdefault.jpg",
    title: "Khoảnh khắc Tuyên ngôn Độc lập (Thước phim màu)",
    date: "1945"
  },
  {
    id: 11,
    url: "https://cdnmedia.baotintuc.vn/Upload/DMDnZyELa7xUDTdLsa19w/files/2021/05/050521/070521/080521/160521/170521/ho-chi-minh-190521.jpg",
    title: "Hồ Chí Minh thắp sáng niềm tin cách mạng",
    date: "1960s"
  },
  {
    id: 12,
    url: "https://bizweb.dktcdn.net/100/567/082/products/nhat-ky-trong-tu-14176-500-master.jpg",
    title: "Bản thảo Bảo vật Quốc gia Nhật ký trong tù",
    date: "1942 - 1943"
  },
  {
    id: 13,
    url: "https://bna.1cdn.vn/2016/10/02/uploaded-dataimages-201609-original-_images1698661_images6751580003_sox54.jpg",
    title: "Bác Hồ với sự nghiệp giáo dục, khuyến học - khuyến tài",
    date: "1960s"
  },
  {
    id: 14,
    url: "https://bna.1cdn.vn/2021/12/06/uploaded-daotuanbna-2021_12_06-_nguyen_ai_quoc_7068408_6122021.jpeg",
    title: "Nguyễn Ái Quốc phát biểu tại Đại hội Đảng ở Marseille",
    date: "1921"
  },
  {
    id: 15,
    url: "https://vnmha.mae.gov.vn/noidung/PublishingImage/06_09_2024_01_19_57_1(4).jpg",
    title: "Bác Hồ tập thể dục (Rèn luyện thân thể theo gương Bác)",
    date: "1960"
  },
  {
    id: 16,
    url: "https://vannghedanang.org.vn/app/upload/post/2022-09-13/thoi-su-van-nghe-10096.jpg",
    title: "Phong thái ung dung của Người trong những năm bôn ba",
    date: "1921"
  },
  {
    id: 17,
    url: "https://baothainguyen.vn/file/e7837c027f6ecd14017ffa4e5f2a0e34/012023/1image_2292197_20230123085956.jpg",
    title: "Người thăm hỏi bà con nông dân trong kỳ thu hoạch",
    date: "1950s"
  },
  {
    id: 18,
    url: "https://media-cdn-v2.laodong.vn/storage/newsportal/2023/9/1/1236241/3-VHTT-1032609-02.jpg",
    title: "Quảng trường Ba Đình - Nơi ghi dấu lịch sử",
    date: "02/09/1945"
  },
  {
    id: 19,
    url: "https://cdn-images.vtv.vn/zoom/700_390/562122370168008704/2023/9/2/photo1693631823563-1693631823877315811306.jpg",
    title: "Ngôi nhà sàn giản dị trong khu di tích Phủ Chủ tịch",
    date: "Hiện nay"
  },
  {
    id: 20,
    url: "https://cdn.baophapluat.vn/w3840/uploaded/phanmo/2024_08_30/anh-3-1715.jpg",
    title: "Xúc động những trang báo viết về ngày Bác đi xa",
    date: "04/09/1969"
  },
  {
    id: 21,
    url: "https://baotanghochiminh.vn/pic/News/images/B%E1%BA%A3o%20t%C3%A0ng%20HCM%20n%C4%83m%202021/Th%C3%A1ng%207/Thumbnails035220160552223--NguyenAiQuoc2.jpg",
    title: "Hành trình Người đi tìm hình của Nước",
    date: "05/06/1911"
  }
];

function GalleryPage() {
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Xử lý nút ESC để đóng ảnh
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImg(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="bg-[#fcf9f2] min-h-screen py-12 md:py-20 font-sans selection:bg-red-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TIÊU ĐỀ TRANG */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h3 className="text-red-700 font-bold uppercase text-sm tracking-[0.3em] mb-3">Tư liệu lịch sử</h3>
          {/* ĐÃ SỬA: Thêm font Lora */}
          <h1 className="text-3xl md:text-5xl font-['Lora',serif] font-black text-red-800 uppercase tracking-tight mb-6">
            Triển lãm Ảnh
          </h1>
          <div className="h-1.5 w-24 bg-red-700 mx-auto rounded-full"></div>
          {/* ĐÃ SỬA: Thêm font Lora */}
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto italic font-medium font-['Lora',serif]">
            "Không gian lưu giữ những khoảnh khắc lịch sử vô giá về cuộc đời và sự nghiệp cách mạng vĩ đại của Chủ tịch Hồ Chí Minh."
          </p>
        </motion.div>

        {/* LƯỚI MASONRY CSS */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6">
          {galleryData.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={item.id}
              onClick={() => setSelectedImg(item)}
              className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 mb-4 md:mb-6"
            >
              <img 
                src={item.url} 
                alt={item.title} 
                className="w-full h-auto block object-cover transform group-hover:scale-105 transition-transform duration-700 bg-gray-200"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-5 text-left">
                <span className="text-yellow-400 text-xs font-bold mb-1 font-sans">{item.date}</span>
                {/* ĐÃ SỬA: Ép text-left và thêm font Lora */}
                <h3 className="text-white font-bold text-sm md:text-base leading-snug font-['Lora',serif] text-left">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* CỬA SỔ BUNG ẢNH (LIGHTBOX) */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 md:p-8"
          >
            {/* Nút Đóng */}
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-50 p-2"
              onClick={() => setSelectedImg(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImg.url} 
              alt={selectedImg.title}
              className="max-w-full max-h-[80vh] object-contain rounded shadow-2xl bg-black/50"
              onClick={(e) => e.stopPropagation()} 
            />

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="mt-6 text-center max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2 font-['Lora',serif]">{selectedImg.title}</h2>
              <p className="text-gray-400 font-medium tracking-widest text-sm uppercase">Năm: {selectedImg.date}</p>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GalleryPage;