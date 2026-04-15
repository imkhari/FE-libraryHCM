import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import Vid1 from '../assets/bai-tho-ngam-trang.mp3';
import Vid2 from '../assets/bai-tho-di-duong.mp3';
import Vid3 from '../assets/bai-tho-nghe-tieng-gia-gao.mp3';

const featuredPoems = [
  {
    id: 1,
    title: "Ngắm trăng",
    subtitle: "(Vọng nguyệt)",
    kanji: "月",
    dich: '"Trong tù không rượu cũng không hoa,\nCảnh đẹp đêm nay khó hững hờ;\nNgười ngắm trăng soi ngoài cửa sổ,\nTrăng nhòm khe cửa ngắm nhà thơ."',
    goc: "獄中無酒亦無花\n對此良宵奈若何\n人向窗前看明月\n月從窗隙看詩家",
    phienAm: "Ngục trung vô tửu diệc vô hoa,\nĐối thử lương tiêu nại nhược hà?\nNhân hướng song tiền khán minh nguyệt,\nNguyệt tòng song khích khán thi gia.",
    desc: "Thể hiện phong thái ung dung, tự tại và sự giao hòa trọn vẹn với thiên nhiên ngay trong hoàn cảnh ngục tù tăm tối.",
    audio: Vid1 
  },
  {
    id: 2,
    title: "Đi đường",
    subtitle: "(Tẩu lộ)",
    kanji: "路",
    dich: '"Đi đường mới biết gian lao,\nNúi cao rồi lại núi cao trập trùng;\nNúi cao lên đến tận cùng,\nThu vào tầm mắt muôn trùng nước non."',
    goc: "走路纔知走路難\n重巒疊嶂阻其間\n攀登最高峰頂後\n萬里秋毫佇盼間",
    phienAm: "Tẩu lộ tài tri tẩu lộ nan,\nTrùng loan điệp chướng trở kỳ gian;\nPhàn đăng tối cao phong đảnh hậu,\nVạn lý thu hào trử phán gian.",
    desc: "Bài học nhân sinh sâu sắc: Vượt qua mọi gian lao, thử thách khốc liệt để vươn tới đỉnh cao thắng lợi huy hoàng.",
    audio: Vid2 
  },
  {
    id: 3,
    title: "Nghe tiếng giã gạo",
    subtitle: "(Văn đảo mễ thanh)",
    kanji: "米",
    dich: '"Gạo đem vào giã bao đau đớn,\nGạo giã xong rồi trắng tựa bông;\nSống ở trên đời người cũng vậy,\nGian nan rèn luyện mới thành công."',
    goc: "米被舂時很痛苦\n舂盡收來白似綿\n人生在世也這樣\n困難也是玉成天",
    phienAm: "Mễ bị thung thì ngận thống khổ,\nThung tận thu lai bạch tự miên;\nNhân sinh tại thế dã giá dạng,\nKhốn nạn dã thị ngọc thành thiên.",
    desc: "Chân lý về sự tu dưỡng, rèn luyện đạo đức cách mạng: Trải qua gian khổ, cọ xát mới có thể tôi luyện nên bản lĩnh con người.",
    audio: Vid3 
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const bannerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

function CategoryPage() {
  const { type } = useParams(); 
  const navigate = useNavigate();
  
  const [displayDocs, setDisplayDocs] = useState([]); 
  const [pageTitle, setPageTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const [activeTabs, setActiveTabs] = useState({ 1: 'dich', 2: 'dich', 3: 'dich' });
  const isInitialMount = useRef(true);

  // Hàm cốt lõi để phân loại dữ liệu (Giữ nguyên của Khải)
  const processAndSetData = (allDocs) => {
    const articles = allDocs.filter(doc => doc.readType === 'HTML' || doc.read_type === 'HTML');
    const toanTap = allDocs.filter(doc => doc.title.toLowerCase().includes('toàn tập'));
    
    const books = allDocs.filter(doc => 
        (doc.readType !== 'HTML' && doc.read_type !== 'HTML') &&
        !doc.title.toLowerCase().includes('toàn tập')
    );
    
    const booksByHoChiMinh = books.slice(0, Math.ceil(books.length / 2));
    const booksAboutHoChiMinh = books.slice(Math.ceil(books.length / 2));

    if (type === 'ho-chi-minh-toan-tap') {
      const sortedToanTap = [...toanTap].sort((a, b) => {
         const numA = parseInt(a.title.match(/\d+/)) || 0;
         const numB = parseInt(b.title.match(/\d+/)) || 0;
         return numA - numB;
      });
      setDisplayDocs(sortedToanTap);
      setPageTitle("Hồ Chí Minh Toàn Tập (15 Tập)");
    }
    else if (type === 'bai-bao') {
      setDisplayDocs(articles);
      setPageTitle("Những bài báo của Hồ Chí Minh");
    } 
    else if (type === 'cua-ho-chi-minh') {
      setDisplayDocs(booksByHoChiMinh);
      setPageTitle("Tác phẩm của Hồ Chí Minh");
    } 
    else if (type === 'nhat-ky-trong-tu') {
      setDisplayDocs(allDocs.filter(doc => doc.title.toLowerCase().includes('nhật ký')));
      setPageTitle('TÁC PHẨM "NHẬT KÝ TRONG TÙ"');
    }
    else if (type === 'tho-ho-chi-minh') {
      const targetThoTitles = [
        "Thơ Hồ Chí Minh - NXB Nghệ An", 
        "Tuyển tập Thơ chúc Tết",
        "Cảnh khuya",
        "Báo tiệp",
        "Tức cảnh Pác Bó",
        "Mộ (Chiều tối)"
      ];
      setDisplayDocs(allDocs.filter(doc => 
        targetThoTitles.some(t => (doc.title || "").toUpperCase().includes(t.toUpperCase()))
      ));
      setPageTitle("THƠ HỒ CHÍ MINH");
    }
    else {
      setDisplayDocs(booksAboutHoChiMinh);
      setPageTitle("Tác phẩm về Hồ Chí Minh");
    }
    
    setLoading(false);
  };

  useEffect(() => {
    // Hiển thị ngay lập tức nếu có dữ liệu cũ trong Cache (Không cần Loading)
    const cachedData = sessionStorage.getItem('allLibraryDocs');
    if (cachedData) {
        processAndSetData(JSON.parse(cachedData));
    } else {
        setLoading(true); // Chỉ bật Loading nếu chưa từng có Cache
    }

    // Ngầm gọi API để lấy dữ liệu mới nhất
    api.get('/documents?page=0&size=150')
      .then((res) => {
        const allDocs = res.data.content || res.data;
        // Nếu dữ liệu API trả về KHÁC với Cache, tiến hành cập nhật giao diện
        if (JSON.stringify(allDocs) !== cachedData) {
            sessionStorage.setItem('allLibraryDocs', JSON.stringify(allDocs));
            processAndSetData(allDocs);
        }
      })
      .catch((err) => {
         console.error("API Fetch Error:", err);
         if (!cachedData) setLoading(false); // Chỉ tắt loading nếu chưa có cache
      });
      
  }, [type]);

  const mainDiaryBook = displayDocs.find(doc => doc.slug === 'nhat-ky-trong-tu-full') || displayDocs[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 overflow-hidden">
      
      {/* TIÊU ĐỀ TRANG CÓ ANIMATION */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center mb-12"
      >
        {type === 'nhat-ky-trong-tu' && (
          <h3 className="text-red-700 font-bold uppercase text-xs md:text-sm tracking-[0.3em] mb-3 animate-pulse">
            ★ Bảo vật Quốc gia ★
          </h3>
        )}
        <h2 className="text-3xl md:text-4xl font-serif font-black text-center text-red-800 uppercase tracking-tight">
          {pageTitle}
        </h2>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="h-1 bg-red-600 mt-5 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]"
        ></motion.div>
      </motion.div>

      {/* BANNER ĐẶC BIỆT CHỈ HIỆN CHO NHẬT KÝ TRONG TÙ */}
      {type === 'nhat-ky-trong-tu' && !loading && (
        <motion.div 
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12 bg-gradient-to-br from-stone-100 to-[#fdfbf2] rounded-2xl p-6 md:p-10 border border-stone-200 flex flex-col md:flex-row gap-8 items-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden"
        >
          <div className="absolute -right-10 -bottom-10 text-9xl font-serif text-stone-200 opacity-50 select-none pointer-events-none">
            獄中日記
          </div>

          <div className="md:w-1/3 flex justify-center relative z-10">
             <motion.div 
               whileHover={{ scale: 1.05 }}
               className="relative group cursor-pointer" 
               onClick={() => mainDiaryBook && navigate(`/book/${mainDiaryBook.id}`)}
             >
                <div className="absolute inset-0 bg-black/20 transform rotate-3 rounded-lg blur-sm transition-transform group-hover:rotate-6 duration-300"></div>
                <img 
                  src="https://bizweb.dktcdn.net/100/567/082/products/nhat-ky-trong-tu-14176-500-master.jpg?v=1747325389133" 
                  loading="lazy"
                  className="rounded-lg shadow-xl relative z-10 w-[180px] md:w-[240px] transform transition-transform group-hover:-translate-y-2 duration-300" 
                  alt="Ngục trung nhật ký" 
                />
             </motion.div>
          </div>

          <div className="md:w-2/3 relative z-10 flex flex-col h-full">
             <h3 className="text-2xl md:text-3xl font-serif font-bold text-red-800 mb-4 tracking-tight">
                Ngục trung nhật ký <span className="text-xl md:text-2xl text-stone-500 font-normal ml-2">(Nhật ký trong tù)</span>
             </h3>
             
             <div className="border-l-4 border-red-700 pl-4 mb-5 bg-red-50/50 py-2 rounded-r-lg">
                <p className="text-stone-700 font-serif text-[17px] italic leading-relaxed">
                  "Thân thể ở trong lao<br/>
                  Tinh thần ở ngoài lao<br/>
                  Muốn nên sự nghiệp lớn<br/>
                  Tinh thần càng phải cao"
                </p>
             </div>
             
             <div className="text-sm md:text-[15px] text-stone-600 leading-relaxed text-justify mb-8 space-y-3">
               <p>
                 Bảo vật quốc gia <b>"Nhật ký trong tù"</b> là tập thơ chữ Hán gồm 133 bài, được Chủ tịch Hồ Chí Minh sáng tác trong thời gian bị chính quyền Tưởng Giới Thạch bắt giam trái phép ở Quảng Tây, Trung Quốc (từ tháng 8/1942 đến tháng 9/1943). 
               </p>
               <p>
                 Được viết dưới dạng nhật ký, tập thơ tái hiện chân thực bức tranh nhà tù tối tăm, hà khắc. Nhưng vượt lên trên gông cùm và đọa đày thể xác, mỗi vần thơ là sự tỏa sáng của tinh thần lạc quan, phong thái ung dung tự tại, cùng lòng yêu nước thiết tha và tình nhân ái bao la của vị lãnh tụ vĩ đại.
               </p>
             </div>

             {mainDiaryBook && (
               <div className="flex gap-4 mt-auto">
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => navigate(`/reader/${mainDiaryBook.id}`)}
                   className="bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 px-6 rounded-md shadow-md flex items-center gap-2 text-sm"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                   Đọc sách
                 </motion.button>
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => window.open(mainDiaryBook.pdfUrl || mainDiaryBook.pdf_url, '_blank')}
                   className="bg-white border-2 border-red-700 text-red-700 hover:bg-red-50 font-bold py-2.5 px-6 rounded-md shadow-md flex items-center gap-2 text-sm"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                   Tải về
                 </motion.button>
               </div>
             )}
          </div>
        </motion.div>
      )}

      {/* KHU VỰC ĐẶC BIỆT: NHỮNG VẦN THƠ TUYỆT BÚT (Có Animation) */}
      {type === 'nhat-ky-trong-tu' && !loading && (
        <div className="mt-16 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center mb-10"
          >
            <h3 className="text-red-700 font-bold uppercase text-xs md:text-sm tracking-[0.3em] mb-2">Giá trị tư tưởng & nghệ thuật</h3>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-center text-red-800 uppercase tracking-tight">
              Những Vần Thơ Tuyệt Bút
            </h2>
            <div className="h-1 w-20 bg-red-600 mt-4 rounded-full"></div>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-2 md:px-4"
          >
            {featuredPoems.map((poem) => (
              <motion.div key={poem.id} variants={itemVariants} className="bg-[#fdfbf2] rounded-xl flex flex-col border border-red-100 shadow-[0_4px_20px_rgba(185,28,28,0.05)] hover:shadow-[0_4px_20px_rgba(185,28,28,0.15)] transition-shadow duration-300 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-700"></div>
                <div className="absolute right-[-20px] bottom-[50px] opacity-5 text-8xl text-red-900 font-serif select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  {poem.kanji}
                </div>
                
                <div className="p-6 md:p-8 flex-1 flex flex-col z-10 relative">
                  <h4 className="text-xl font-bold text-red-800 mb-1">{poem.title}</h4>
                  <p className="text-xs text-gray-500 italic mb-4">{poem.subtitle}</p>
                  
                  <div className="flex bg-white rounded-md border border-red-100 p-1 mb-5">
                    <button 
                      onClick={() => setActiveTabs({...activeTabs, [poem.id]: 'dich'})}
                      className={`flex-1 text-[12px] font-bold py-1.5 rounded transition-colors ${activeTabs[poem.id] === 'dich' ? 'bg-red-50 text-red-700' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      Dịch thơ
                    </button>
                    <button 
                      onClick={() => setActiveTabs({...activeTabs, [poem.id]: 'goc'})}
                      className={`flex-1 text-[12px] font-bold py-1.5 rounded transition-colors ${activeTabs[poem.id] === 'goc' ? 'bg-red-50 text-red-700' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      Nguyên tác
                    </button>
                  </div>

                  <div className="min-h-[120px] mb-6">
                    {activeTabs[poem.id] === 'dich' ? (
                      <motion.p 
                        key="dich"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-stone-700 font-serif text-[15px] leading-relaxed whitespace-pre-line italic"
                      >
                        {poem.dich}
                      </motion.p>
                    ) : (
                      <motion.div key="goc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                        <p className="text-stone-700 font-serif text-[14px] leading-relaxed whitespace-pre-line border-l-2 border-red-200 pl-3">
                          {poem.goc}
                        </p>
                        <p className="text-stone-500 font-serif text-[14px] leading-relaxed whitespace-pre-line">
                          {poem.phienAm}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <div className="mt-auto pt-4 border-t border-dashed border-red-200">
                    <p className="text-[13px] text-stone-600 text-justify mb-4">
                      {poem.desc}
                    </p>
                    
                    <div className="bg-red-50 rounded-lg p-2 flex items-center gap-3 border border-red-100">
                      <div className="bg-red-700 text-white rounded-full p-2 shrink-0 animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" /></svg>
                      </div>
                      {/* 🚀 TỐI ƯU AUDIO: Preload Metadata giúp load siêu nhanh, k tải ngầm tốn 4G */}
                      <audio controls preload="metadata" className="h-8 w-full outline-none" src={poem.audio}>
                        Trình duyệt không hỗ trợ audio
                      </audio>
                    </div>
                  </div>
                  
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* DANH SÁCH CÁC TRANG CÒN LẠI */}
      {type !== 'nhat-ky-trong-tu' && (
        <>
          {loading ? (
            <div className="text-center py-20 italic text-gray-500">Đang tải dữ liệu...</div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
            >
              {displayDocs.length > 0 ? (
                displayDocs.map((doc) => (
                  <motion.div 
                    variants={itemVariants}
                    key={doc.id} 
                    onClick={() => navigate(`/book/${doc.id}`)} 
                    className="group cursor-pointer flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-xl hover:border-red-300 transition-shadow duration-300 relative"
                  >
                    <div className="aspect-[2/3] overflow-hidden bg-gray-100">
                      {/* 🚀 TỐI ƯU ẢNH: Lazy load - Chỉ tải khi cuộn chuột tới */}
                      <motion.img 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                        src={doc.coverImageUrl || 'https://via.placeholder.com/400x600?text=No+Cover'} 
                        loading="lazy"
                        className="w-full h-full object-cover" 
                        alt={doc.title} 
                      />
                      {type === 'ho-chi-minh-toan-tap' && (
                        <div className="absolute top-2 right-2 bg-red-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                          2011
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-red-700 transition-colors">
                        {doc.title}
                      </h3>
                      <p className="mt-auto pt-2 text-[11px] text-gray-500 italic">
                        {doc.author || 'Đang cập nhật'}
                      </p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  Chưa có tài liệu nào trong mục này.
                </div>
              )}
            </motion.div>
          )}
        </>
      )}

    </div>
  );
}

export default CategoryPage;