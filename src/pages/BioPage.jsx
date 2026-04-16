import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const leftColumnVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const rightColumnVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const mapNodeVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 15 } }
};

const lineVerticalVariants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: { scaleY: 1, opacity: 1, transition: { duration: 0.6, ease: "easeInOut" } }
};

// COMPONENT MŨI TÊN 
const ArrowDownRed = () => (
  <motion.div variants={lineVerticalVariants} className="w-1.5 h-10 md:h-14 bg-red-500 relative my-1 origin-top rounded-full">
    <div className="absolute -bottom-2 -left-[6px] w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[10px] border-t-red-500"></div>
  </motion.div>
);

function BioPage() {
  const portraitUrl = "https://upload.wikimedia.org/wikipedia/commons/1/1c/Ho_Chi_Minh_1946.jpg";
  const contentRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setTimeout(() => {
        contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }

    const handleScroll = () => {
      if (window.pageYOffset > 400) setShowScrollTop(true);
      else setShowScrollTop(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const timelineData = [
    { year: "19/05/1890", title: "Quê hương và Tuổi thơ", content: "Chủ tịch Hồ Chí Minh (lúc nhỏ tên là Nguyễn Sinh Cung, sau đổi là Nguyễn Tất Thành, Nguyễn Ái Quốc) sinh ra trong một gia đình nhà nho yêu nước tại làng Hoàng Trù, xã Kim Liên, huyện Nam Đàn, tỉnh Nghệ An. Được nuôi dưỡng bởi truyền thống văn hóa tốt đẹp của gia đình và quê hương, Người sớm có lòng yêu nước thương dân sâu sắc và ý chí quyết tâm đánh đuổi thực dân Pháp, giành độc lập cho Tổ quốc." },
    { year: "05/06/1911", title: "Ra đi tìm đường cứu nước", content: "Chứng kiến sự thất bại của các phong trào yêu nước trước đó, Nguyễn Tất Thành quyết tâm đi ra nước ngoài tìm một con đường cứu nước mới. Ngày 5 tháng 6 năm 1911, với tên gọi Văn Ba, Người làm phụ bếp trên con tàu Amiral Latouche-Tréville, rời bến cảng Nhà Rồng (Sài Gòn), bắt đầu cuộc hành trình bôn ba suốt 30 năm qua ba đại dương, bốn châu lục." },
    { year: "1911 - 1920", title: "Đến với Chủ nghĩa Mác - Lênin", content: "Người đi qua nhiều nước châu Âu, châu Phi, châu Mỹ, vừa lao động kiếm sống vừa quan sát, học hỏi. Năm 1919, Người gửi 'Bản yêu sách của nhân dân An Nam' tới Hội nghị Versailles. Tháng 7/1920, Người đọc 'Sơ thảo lần thứ nhất những luận cương về vấn đề dân tộc và vấn đề thuộc địa' của V.I. Lênin, từ đó tìm thấy con đường giải phóng dân tộc. Cuối năm 1920, Người tham gia sáng lập Đảng Cộng sản Pháp." },
    { year: "1923 - 1924", title: "Hoạt động tại Liên Xô", content: "Tháng 6/1923, Người rời Pháp sang Liên Xô - quê hương của Cách mạng Tháng Mười. Tại đây, Người học tập tại Đại học Phương Đông, tham dự Đại hội lần thứ V của Quốc tế Cộng sản và được bầu làm Ủy viên Đoàn Chủ tịch Quốc tế Nông dân. Đây là giai đoạn Người trực tiếp nghiên cứu lý luận và kinh nghiệm tổ chức cách mạng vô sản." },
    { year: "1925 - 1927", title: "Chuẩn bị lực lượng tại Quảng Châu (Trung Quốc)", content: "Cuối năm 1924, Người về Quảng Châu (Trung Quốc). Năm 1925, Người thành lập 'Hội Việt Nam Cách mạng Thanh niên' - tổ chức tiền thân của Đảng, xuất bản tờ báo 'Thanh Niên' và mở các lớp huấn luyện cán bộ. Những bài giảng của Người được tập hợp thành cuốn sách 'Đường Kách mệnh' (1927) - cuốn cẩm nang lý luận đầu tiên của cách mạng Việt Nam." },
    { year: "03/02/1930", title: "Thành lập Đảng Cộng sản Việt Nam", content: "Đáp ứng đòi hỏi của phong trào cách mạng trong nước, từ ngày 06/01 đến 07/02/1930 tại Cửu Long (Hương Cảng, Trung Quốc), Nguyễn Ái Quốc đã chủ trì Hội nghị hợp nhất ba tổ chức cộng sản, chính thức thành lập Đảng Cộng sản Việt Nam, đồng thời thông qua Chánh cương vắn tắt, Sách lược vắn tắt do Người khởi thảo." },
    { year: "1931 - 1933", title: "Vượt qua lao tù ở Hương Cảng", content: "Tháng 6/1931, Nguyễn Ái Quốc (với bí danh Tống Văn Sơ) bị thực dân Anh bắt giam trái phép tại Hương Cảng. Trải qua những phiên tòa xét xử và những tháng ngày gian khổ trong ngục tù, nhờ sự can thiệp của luật sư Loseby và Tổ chức Cứu tế Đỏ quốc tế, Người được trả tự do vào đầu năm 1933 và tiếp tục trở lại Liên Xô học tập, công tác." },
    { year: "28/01/1941", title: "Mùa xuân lịch sử: Trở về Tổ quốc", content: "Sau 30 năm bôn ba, ngày 28/1/1941, Người trở về nước, trực tiếp lãnh đạo cách mạng Việt Nam tại hang Pác Bó (Cao Bằng). Tháng 5/1941, Người chủ trì Hội nghị Trung ương Đảng lần thứ 8, đặt nhiệm vụ giải phóng dân tộc lên hàng đầu và quyết định thành lập 'Mặt trận Việt Minh'." },
    { year: "1942 - 1943", title: "Mười bốn tháng tù ngục và 'Nhật ký trong tù'", content: "Tháng 8/1942, lấy tên là Hồ Chí Minh, Người sang Trung Quốc để liên lạc với các lực lượng đồng minh chống phát xít. Tuy nhiên, Người bị chính quyền Tưởng Giới Thạch bắt giam và giải đi gần 30 nhà giam ở Quảng Tây trong suốt 14 tháng. Trong chốn lao tù, Người đã sáng tác tập thơ bất hủ 'Nhật ký trong tù' (Ngục trung nhật ký)." },
    { year: "02/09/1945", title: "Khai sinh Nước Việt Nam Dân chủ Cộng hòa", content: "Sau khi thoát khỏi nhà tù, Người trở về nước lãnh đạo Tổng khởi nghĩa Cách mạng Tháng Tám thành công. Ngày 2/9/1945, tại Quảng trường Ba Đình lịch sử, Chủ tịch Hồ Chí Minh đã đọc bản Tuyên ngôn Độc lập, trịnh trọng tuyên bố trước toàn thế giới sự ra đời của nước Việt Nam Dân chủ Cộng hòa." },
    { year: "19/12/1946", title: "Lời kêu gọi Toàn quốc kháng chiến", content: "Thực dân Pháp dã tâm cướp nước ta một lần nữa. Để bảo vệ nền độc lập non trẻ, đêm 19/12/1946, Chủ tịch Hồ Chí Minh đã ra Lời kêu gọi Toàn quốc kháng chiến với lời thề bất hủ: 'Chúng ta thà hy sinh tất cả, chứ nhất định không chịu mất nước, nhất định không chịu làm nô lệ'. Người tiếp tục lãnh đạo toàn dân làm nên chiến thắng Điện Biên Phủ (1954)." },
    { year: "1954 - 1969", title: "Kháng chiến chống Mỹ và Bản Di chúc thiêng liêng", content: "Miền Bắc được giải phóng, miền Nam vẫn chìm trong ách đô hộ của đế quốc Mỹ. Bác Hồ cùng Trung ương Đảng lãnh đạo nhân dân thực hiện hai nhiệm vụ chiến lược: Xây dựng CNXH ở miền Bắc và giải phóng miền Nam. Trước lúc đi xa, Người đã để lại bản Di chúc lịch sử - một tài sản tinh thần vô giá, dặn dò toàn Đảng, toàn dân đoàn kết, xây dựng một nước Việt Nam hòa bình, thống nhất, độc lập, dân chủ và giàu mạnh. Ngày 2/9/1969, Người trút hơi thở cuối cùng." }
  ];

  return (
    <div className="min-h-screen bg-[#fcf9f2] py-12 px-4 font-sans selection:bg-red-200 relative">
      <div ref={contentRef} className="max-w-7xl mx-auto scroll-mt-20">

        {/* NÚT BACK */}
        <Link
          to="/"
          onClick={scrollToTop}
          className="inline-flex items-center text-red-700 hover:text-red-900 font-bold mb-8 transition-colors group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Trang chủ
        </Link>

        {/* TIÊU ĐỀ CHÍNH */}
        <motion.div initial="hidden" animate="visible" variants={itemVariants} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-red-800 uppercase tracking-wide mb-4 drop-shadow-sm">
            Cuộc đời và Sự nghiệp
          </h1>
          <div className="h-1.5 w-24 bg-yellow-500 mx-auto rounded-full shadow-sm"></div>
          <p className="mt-5 text-xl text-gray-700 font-serif italic">
            Chủ tịch Hồ Chí Minh (1890 - 1969)
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative w-full">

          {/* CỘT TRÁI (Ảnh chân dung - STICKY) - Giữ nguyên hoàn toàn */}
          <motion.div
            variants={leftColumnVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:w-[32%] lg:sticky lg:top-28 flex flex-col items-center z-20"
          >
            <div className="p-3 bg-white shadow-2xl rounded border-2 border-red-800/10 relative group">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-800"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-800"></div>
              <img src={portraitUrl} alt="Chân dung Bác Hồ" className="w-full max-w-sm h-auto object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-700 shadow-inner" />
            </div>
            <div className="mt-8 bg-white/60 px-6 py-4 border-l-4 border-red-700 shadow-sm rounded-r-lg w-full max-w-sm">
              <p className="text-sm text-gray-700 font-serif italic text-justify leading-relaxed">
                "Tôi chỉ có một sự ham muốn, ham muốn tột bậc, là làm sao cho nước ta được hoàn toàn độc lập, dân ta được hoàn toàn tự do, đồng bào ai cũng có cơm ăn áo mặc, ai cũng được học hành."
              </p>
            </div>
          </motion.div>

          {/* CỘT PHẢI (Chứa Timeline và Sơ đồ tư duy) */}
          <div className="w-full lg:w-[68%] flex flex-col">

            {/* TIMELINE SECTION - Đã nâng cấp UI thẻ Card 3D và Framer Motion */}
            <motion.div variants={rightColumnVariants} initial="hidden" animate="visible" className="bg-white p-6 md:p-10 rounded-2xl shadow-xl border border-red-50/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-black text-gray-800 mb-10 pb-4 border-b-2 border-red-100 uppercase tracking-widest flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Dòng thời gian lịch sử
                </h2>
                
                {/* Dây cuộn Timeline */}
                <div className="space-y-12 border-l-[3px] border-red-100 ml-3 md:ml-4 relative">
                  {timelineData.map((item, index) => {
                    const yearWatermark = item.year.slice(-4); // Lấy 4 số cuối làm watermark bóng mờ
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 100, delay: 0.1 }}
                        key={index} 
                        className="relative pl-8 md:pl-12 group"
                      >
                        {/* Nút mốc thời gian */}
                        <div className="absolute -left-[14px] md:-left-[15px] top-4 w-6 h-6 md:w-7 md:h-7 bg-red-700 rounded-full border-4 border-white shadow-md group-hover:bg-yellow-500 group-hover:scale-125 transition-all duration-300 z-10 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full group-hover:hidden"></div>
                        </div>

                        {/* Thẻ Card nội dung (Glassmorphism) */}
                        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_5px_20px_rgba(185,28,28,0.05)] border border-red-50 group-hover:shadow-[0_15px_30px_rgba(185,28,28,0.12)] transition-all duration-300 relative overflow-hidden">
                          
                          {/* Hiệu ứng nền mờ khi Hover */}
                          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-red-100 transition-colors duration-500"></div>

                          {/* Hiển thị năm watermark to bản, nhạt màu phía sau */}
                          <div className="absolute top-2 right-4 opacity-5 font-black text-6xl md:text-7xl text-red-900 pointer-events-none select-none">
                            {yearWatermark}
                          </div>

                          <div className="relative z-10">
                            <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-red-50 to-white text-red-800 text-sm font-black rounded-lg mb-4 border border-red-100 shadow-sm">
                              {item.year}
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-red-700 transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-justify font-serif text-[15px] md:text-[16px]">
                              {item.content}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* SƠ ĐỒ TƯ DUY - Giữ nguyên hoàn toàn */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="mt-20 pt-16 border-t-2 border-dashed border-red-200 w-full"
            >
              <div className="text-center mb-16 px-2">
                <h3 className="text-red-700 font-bold uppercase text-sm tracking-[0.3em] mb-3">Phân tích Lịch sử</h3>
                <h2 className="text-[26px] sm:text-3xl md:text-4xl font-black text-red-800 uppercase tracking-tight leading-tight mx-auto max-w-2xl">
                  Tầm nhìn vĩ đại <br className="hidden sm:block" /> về con đường cứu nước
                </h2>
                <div className="h-1.5 w-24 bg-red-600 mx-auto mt-5 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
              </div>

              <div className="flex flex-col items-center w-full px-4">

                {/* BƯỚC 1 */}
                <motion.div variants={mapNodeVariants} className="bg-red-800 text-white font-black text-base md:text-xl px-6 py-5 rounded-xl shadow-[0_10px_20px_rgba(185,28,28,0.3)] z-10 text-center border-2 border-red-600 w-full max-w-2xl">
                  MỤC TIÊU TỐI THƯỢNG:<br />ĐÁNH ĐUỔI THỰC DÂN, GIÀNH ĐỘC LẬP
                </motion.div>

                <ArrowDownRed />

                {/* BƯỚC 2 */}
                <motion.div variants={mapNodeVariants} className="bg-red-50 border-2 border-red-600 p-6 md:p-8 rounded-2xl w-full max-w-2xl shadow-[0_8px_20px_rgba(220,38,38,0.15)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600"></div>
                  <h3 className="text-xl md:text-2xl font-black text-red-800 mb-1 text-center">NGUYỄN TẤT THÀNH</h3>
                  <p className="text-sm md:text-base text-red-600 mb-6 text-center font-serif italic">Khởi hành từ Bến cảng Nhà Rồng</p>

                  <ul className="space-y-4 text-sm md:text-base text-gray-800 text-justify">
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 font-bold mt-0.5 text-lg">✔</span>
                      <div><b>Tư duy độc lập:</b> Kiên quyết không đi theo lối mòn đã thất bại của các phong trào trước đó.</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 font-bold mt-0.5 text-lg">✔</span>
                      <div><b>Tầm nhìn đột phá:</b> Hướng sang phương Tây để tìm hiểu tận gốc rễ sào huyệt của chủ nghĩa đế quốc.</div>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-white border-l-4 border-red-600 italic text-[14px] md:text-base text-red-900 shadow-sm rounded-r">
                    "Muốn đánh hổ phải vào hang hổ. Phải xem nước Pháp làm thế nào rồi về giúp đồng bào."
                  </div>
                </motion.div>

                <ArrowDownRed />

                {/* BƯỚC 3 */}
                <motion.div variants={mapNodeVariants} className="bg-yellow-50 border-2 border-yellow-500 p-6 rounded-xl w-full max-w-2xl shadow-md relative">
                  <div className="absolute -left-3 -top-3 bg-yellow-500 text-white text-sm font-black px-3 py-1 rounded-lg shadow-md tracking-wider">NĂM 1920</div>
                  <h4 className="font-black text-red-800 uppercase text-lg md:text-xl mb-3 text-center mt-2">Bắt gặp Ánh sáng Chân lý</h4>
                  <p className="text-sm md:text-base text-gray-700 text-center leading-relaxed">
                    Tìm ra con đường giải phóng dân tộc: Chỉ có <b>Chủ nghĩa xã hội và Chủ nghĩa cộng sản</b> mới giải phóng được các dân tộc bị áp bức.
                  </p>
                </motion.div>

                <ArrowDownRed />

                {/* BƯỚC 4 */}
                <motion.div variants={mapNodeVariants} className="bg-white border-2 border-red-800 p-6 md:p-8 rounded-xl w-full max-w-2xl shadow-[0_10px_25px_rgba(185,28,28,0.15)]">
                  <h4 className="font-black text-red-800 uppercase text-lg md:text-xl mb-5 text-center">Vận dụng Sáng tạo</h4>
                  <ul className="space-y-4 text-sm md:text-base text-gray-800 font-medium">
                    <li className="flex items-center gap-3">
                      <span className="text-red-600 text-xl">★</span>
                      Độc lập dân tộc gắn liền với Chủ nghĩa xã hội.
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-red-600 text-xl">★</span>
                      Cách mạng thuộc địa liên kết chặt chẽ với chính quốc.
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-red-600 text-xl">★</span>
                      Đại đoàn kết toàn dân tộc do Đảng Cộng sản lãnh đạo.
                    </li>
                  </ul>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default BioPage;