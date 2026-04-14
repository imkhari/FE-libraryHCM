import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';

function CategoryPage() {
  const { type } = useParams(); // Lấy chữ 'cua-ho-chi-minh', 've-ho-chi-minh', hoặc 'bai-bao' từ thanh địa chỉ
  const navigate = useNavigate();
  
  const [displayDocs, setDisplayDocs] = useState([]); // Đổi tên state cho chuẩn nghĩa hơn
  const [pageTitle, setPageTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Lấy toàn bộ dữ liệu từ Backend
    api.get('/documents?page=0&size=100')
      .then((res) => {
        const allDocs = res.data.content;
        
        // 1. Tách mảng giống hệt trang Home
        const articles = allDocs.filter(doc => doc.readType === 'BAI_BAO' || doc.read_type === 'BAI_BAO');
        const books = allDocs.filter(doc => doc.readType !== 'BAI_BAO' && doc.read_type !== 'BAI_BAO');
        
        const booksByHoChiMinh = books.slice(0, Math.ceil(books.length / 2));
        const booksAboutHoChiMinh = books.slice(Math.ceil(books.length / 2));

        // 2. Kiểm tra URL đang ở trang nào thì đổ dữ liệu và đổi Tiêu đề trang đó
        if (type === 'bai-bao') {
          setDisplayDocs(articles);
          setPageTitle("Những bài báo của Hồ Chí Minh");
        } 
        else if (type === 'cua-ho-chi-minh') {
          setDisplayDocs(booksByHoChiMinh);
          setPageTitle("Tác phẩm của Hồ Chí Minh");
        } 
        else {
          setDisplayDocs(booksAboutHoChiMinh);
          setPageTitle("Tác phẩm về Hồ Chí Minh");
        }
        
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [type]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* TIÊU ĐỀ THÔNG MINH TỰ ĐỘNG ĐỔI */}
      <h2 className="text-3xl font-black text-red-800 uppercase text-center mb-10 tracking-tight">
        {pageTitle}
      </h2>
      
      {loading ? (
        <div className="text-center py-20 italic text-gray-500">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {displayDocs.length > 0 ? (
            displayDocs.map((doc) => (
              <div 
                key={doc.id} 
                onClick={() => navigate(`/book/${doc.id}`)} // Route chuyển sang trang đọc sách/báo
                className="group cursor-pointer flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-xl transition-all"
              >
                <div className="aspect-[2/3] overflow-hidden bg-gray-100">
                  <img 
                    src={doc.coverImageUrl || 'https://via.placeholder.com/400x600?text=No+Cover'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={doc.title} 
                  />
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-red-700">
                    {doc.title}
                  </h3>
                  <p className="mt-auto pt-2 text-[11px] text-gray-500 italic">
                    {doc.author || 'Đang cập nhật'}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              Chưa có tài liệu nào trong mục này.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;