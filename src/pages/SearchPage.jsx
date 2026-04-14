import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';

// 🌟 ANIMATION NHẸ NHÀNG, TINH TẾ 🌟
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

// 🌟 HÀM CHUẨN HÓA TIẾNG VIỆT (Giúp tìm kiếm chính xác tuyệt đối) 🌟
const removeAccents = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

function SearchPage() {
  // Lấy từ khóa và loại bỏ khoảng trắng thừa ở 2 đầu
  const query = (new URLSearchParams(useLocation().search).get('q') || '').trim();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      setLoading(true);
      
      api.get('/documents?page=0&size=150')
        .then(res => {
          const allDocs = res.data.content;
          
          // Tạo ra từ khóa đã được "tẩy" sạch dấu tiếng Việt
          const normalizedQuery = removeAccents(query);

          const filtered = allDocs.filter(book => {
            // Lấy data sách và cũng "tẩy" sạch dấu
            const normTitle = removeAccents(book.title);
            const normAuthor = removeAccents(book.author);
            
            // Tìm kiếm theo CỤM TỪ CHÍNH XÁC (Không bị tách chữ)
            return normTitle.includes(normalizedQuery) || normAuthor.includes(normalizedQuery);
          });

          setResults(filtered);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 min-h-screen bg-[#fcf9f2]">
      
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center mb-14"
      >
        <h2 className="text-3xl font-serif font-black text-red-700 uppercase tracking-tight">
          Kết quả tìm kiếm
        </h2>
        <div className="h-1 w-16 bg-red-700 mt-4 rounded-full"></div>
        
        {query && !loading && (
          <p className="text-gray-600 mt-5 text-[15px]">
            Tìm thấy <b className="text-red-700 text-lg mx-1">{results.length}</b> tài liệu cho từ khóa: 
            <span className="font-bold text-red-700 ml-1">"{query}"</span>
          </p>
        )}
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
           <svg className="animate-spin h-8 w-8 text-red-700 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
           <span className="font-medium text-sm tracking-widest uppercase">Đang tìm kiếm...</span>
        </div>
      ) : results.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8"
        >
          {results.map((book) => (
            <motion.div 
              variants={itemVariants}
              key={book.id} 
              onClick={() => navigate(`/book/${book.id}`)}
              className="group cursor-pointer flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-xl hover:border-red-200 transition-all duration-300 relative"
            >
              <div className="aspect-[2/3] overflow-hidden bg-stone-100">
                <img 
                  src={book.coverImageUrl || 'https://via.placeholder.com/400x600?text=No+Cover'} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={book.title} 
                />
              </div>
              <div className="p-4 flex-1 flex flex-col bg-white">
                <h3 className="text-[14px] font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-red-700 transition-colors">
                  {book.title}
                </h3>
                <p className="mt-auto pt-3 text-[12px] text-gray-500 font-medium italic border-t border-dashed border-gray-100">
                  {book.author || 'Đang cập nhật'}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 px-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
          <p className="text-gray-500 text-center mb-6 text-[15px]">
            Thư viện không có tài liệu nào khớp với từ khóa <b className="text-gray-800">"{query}"</b>.<br/>
            Vui lòng thử lại với một từ khóa khác.
          </p>
          <button 
            onClick={() => navigate('/')} 
            className="text-red-700 font-bold hover:text-red-800 hover:underline transition-colors text-[14px] flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Quay lại trang chủ
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default SearchPage;