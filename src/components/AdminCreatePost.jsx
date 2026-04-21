import React, { useState } from 'react';
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from '../services/api';

export default function AdminCreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('TIN_TUC'); 
  const [isLoading, setIsLoading] = useState(false);

  const modules = { toolbar: [ [{ 'header': [1, 2, 3, false] }], ['bold', 'italic', 'underline'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], ['link', 'image'] ] };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert("Thầy/Cô quên chưa nhập Tiêu đề bài viết ạ!");
    if (!content || content === '<p><br></p>') return alert("Thầy/Cô chưa nhập Nội dung bài viết ạ!");

    setIsLoading(true);
    try {
      // GỌI API THỰC TẾ: Đăng bài viết mới (Đã tự động có Token)
      await api.post('/articles', {
        title: title,
        content: content,
        category: category
      });
      
      alert("ĐĂNG BÀI THÀNH CÔNG! Bài viết đã được lưu vào hệ thống.");
      setTitle('');
      setContent('');
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 403) {
         alert("Lỗi phân quyền: Thầy/cô vui lòng đăng xuất và đăng nhập lại!");
      } else {
         alert("Có lỗi xảy ra khi lưu bài viết.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto pb-20">
      <h1 className="text-3xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2 mb-8 uppercase">✍️ Viết bài mới</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col gap-10">
        
        {/* Bước 1 */}
        <div>
          <h2 className="text-xl font-bold text-red-700 mb-3">Bước 1: Chọn loại bài viết</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className={`flex-1 cursor-pointer border-2 rounded-xl p-4 transition-all ${category === 'TIN_TUC' ? 'border-red-600 bg-red-50' : 'border-gray-200'}`}>
              <input type="radio" className="hidden" checked={category === 'TIN_TUC'} onChange={() => setCategory('TIN_TUC')} />
              <div className="font-bold text-lg text-gray-800">📢 Tin tức - Sự kiện</div>
            </label>
            <label className={`flex-1 cursor-pointer border-2 rounded-xl p-4 transition-all ${category === 'HOC_TAP_BAC' ? 'border-red-600 bg-red-50' : 'border-gray-200'}`}>
              <input type="radio" className="hidden" checked={category === 'HOC_TAP_BAC'} onChange={() => setCategory('HOC_TAP_BAC')} />
              <div className="font-bold text-lg text-gray-800">🌟 Học tập và làm theo Bác</div>
            </label>
          </div>
        </div>

        {/* Bước 2 */}
        <div>
          <h2 className="text-xl font-bold text-red-700 mb-3">Bước 2: Viết tiêu đề</h2>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề..." className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-xl" />
        </div>

        {/* Bước 3 */}
        <div>
          <h2 className="text-xl font-bold text-red-700 mb-3">Bước 3: Soạn nội dung</h2>
          <div className="bg-white"><ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} style={{ height: '350px', marginBottom: '50px' }} /></div>
        </div>

        <div className="border-t pt-8 mt-4 text-right">
          <button type="submit" disabled={isLoading} className="py-4 px-10 bg-red-800 hover:bg-red-700 text-white text-xl font-bold rounded-xl shadow-xl transition-all">
            {isLoading ? "ĐANG TẢI LÊN..." : "ĐĂNG BÀI VIẾT"}
          </button>
        </div>
      </form>
    </div>
  );
}