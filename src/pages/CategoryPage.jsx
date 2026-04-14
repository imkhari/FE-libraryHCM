import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';

function CategoryPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Lấy toàn bộ sách từ Backend
    api.get('/documents?page=0&size=100')
      .then((res) => {
        const all = res.data.content;
        // Logic lọc sơ bộ dựa trên URL type
        if (type === 'cua-ho-chi-minh') {
          setBooks(all.slice(0, 15));
        } else if (type === 've-ho-chi-minh') {
          setBooks(all.slice(15, 30));
        } else {
          setBooks(all);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [type]);

  const title = type === 'cua-ho-chi-minh' ? "Tác phẩm của Hồ Chí Minh" : "Tác phẩm về Hồ Chí Minh";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-black text-red-800 uppercase text-center mb-10 tracking-tight">{title}</h2>
      
      {loading ? (
        <div className="text-center py-20 italic">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {books.map((book) => (
            <div 
              key={book.id} 
              onClick={() => navigate(`/book/${book.id}`)}
              className="group cursor-pointer flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-xl transition-all"
            >
              <div className="aspect-[2/3] overflow-hidden bg-gray-100">
                <img src={book.coverImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={book.title} />
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-red-700">{book.title}</h3>
                <p className="mt-auto pt-2 text-[11px] text-gray-500">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;