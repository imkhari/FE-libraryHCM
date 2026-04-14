import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api';

function SearchPage() {
  const query = new URLSearchParams(useLocation().search).get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      setLoading(true);
      // Gọi API lấy toàn bộ sách để lọc ở Frontend (hoặc Backend nếu bạn đã viết hàm Search)
      api.get('/documents?page=0&size=100')
        .then(res => {
          const filtered = res.data.content.filter(book => 
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            (book.author && book.author.toLowerCase().includes(query.toLowerCase()))
          );
          setResults(filtered);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 min-h-screen">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-black text-red-800 uppercase">Kết quả tìm kiếm</h2>
        <p className="text-gray-500 mt-2">Tìm thấy {results.length} tài liệu cho từ khóa: <span className="font-bold text-red-600">"{query}"</span></p>
      </div>

      {loading ? (
        <div className="text-center py-20 animate-pulse font-medium text-gray-400">Đang lục tìm thư viện...</div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {results.map((book) => (
            <div 
              key={book.id} 
              onClick={() => navigate(`/book/${book.id}`)}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all border border-gray-100 p-2 cursor-pointer group"
            >
              <div className="aspect-[2/3] overflow-hidden rounded-lg mb-3">
                <img src={book.coverImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={book.title} />
              </div>
              <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight group-hover:text-red-700">{book.title}</h3>
              <p className="text-[11px] text-gray-500 mt-2 italic">{book.author || 'Đang cập nhật'}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
          <p className="text-gray-400 font-medium">Không tìm thấy tài liệu nào khớp với từ khóa của bạn.</p>
          <button onClick={() => navigate('/')} className="mt-4 text-red-700 font-bold hover:underline">Quay lại trang chủ</button>
        </div>
      )}
    </div>
  );
}

export default SearchPage;