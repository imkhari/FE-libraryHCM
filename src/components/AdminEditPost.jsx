import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../services/api';

export default function AdminEditPost() {
  const { id } = useParams(); // Lấy ID bài viết từ URL
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('TIN_TUC');
  const [content, setContent] = useState('');
  
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu cũ
  const [saving, setSaving] = useState(false);  // Trạng thái đang lưu

  // HÚT DỮ LIỆU CŨ LÊN FORM
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);
        const article = res.data;
        setTitle(article.title);
        setCategory(article.category);
        setContent(article.content);
      } catch (error) {
        alert("Lỗi không tìm thấy bài viết!");
        navigate('/admin/articles'); // Lỗi thì đá về trang danh sách
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id, navigate]);

  // XỬ LÝ KHI BẤM NÚT LƯU (GỌI LỆNH PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Vui lòng nhập đầy đủ Tiêu đề và Nội dung!");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/articles/${id}`, {
        title,
        category,
        content
      });
      alert("Cập nhật bài viết thành công!");
      navigate('/admin/articles'); // Lưu xong quay về bảng danh sách
    } catch (error) {
      alert("Lỗi khi cập nhật bài viết!");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Cấu hình thanh công cụ cho khung soạn thảo
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500 font-['Lora',serif]">Đang tải dữ liệu bài viết...</div>;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in font-['Lora',serif]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800">Chỉnh sửa bài viết</h1>
        <p className="text-gray-500 mt-1">Cập nhật nội dung cho bài viết #{id}</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-bold mb-2 uppercase text-sm">Tiêu đề bài viết</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-gray-800"
                placeholder="Nhập tiêu đề..."
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-bold mb-2 uppercase text-sm">Chuyên mục</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 cursor-pointer font-semibold"
              >
                <option value="TIN_TUC">Tin tức - Sự kiện</option>
                <option value="HOC_TAP_BAC">Học tập & Làm theo Bác</option>
              </select>
            </div>
          </div>

          <div className="h-[450px] mb-12">
            <label className="block text-gray-700 font-bold mb-2 uppercase text-sm">Nội dung chi tiết</label>
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              modules={modules}
              className="h-full rounded-xl bg-white"
            />
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => navigate('/admin/articles')}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className={`flex-1 px-6 py-3 text-white font-bold rounded-xl transition-all shadow-md uppercase tracking-wider ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}`}
            >
              {saving ? 'ĐANG LƯU THAY ĐỔI...' : 'CẬP NHẬT BÀI VIẾT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}