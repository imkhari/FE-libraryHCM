import React, { useState } from 'react';
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from '../services/api';
import { HiPencilAlt, HiSpeakerphone, HiSparkles } from 'react-icons/hi';

export default function AdminCreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('TIN_TUC');
  const [isLoading, setIsLoading] = useState(false);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'color', 'background', 'script',
    'list', 'indent', 'align',
    'link', 'image', 'video', 'code-block'
  ];

  const cleanWordGarbageBeforeSave = (rawHtml) => {
    if (!rawHtml) return "";
    return rawHtml
      .replace(/word-break\s*:\s*[^;"]+;?/gi, '')
      .replace(/text-align\s*:\s*justify;?/gi, 'text-align: left;')
      .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')
      .replace(/class="Mso[^"]*"/gi, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return alert("Thầy/Cô quên chưa nhập Tiêu đề bài viết ạ!");
    if (!content || content === '<p><br></p>') return alert("Thầy/Cô chưa nhập Nội dung bài viết ạ!");

    setIsLoading(true);
    try {
      const cleanContent = cleanWordGarbageBeforeSave(content);
      await api.post('/articles', {
        title: title,
        content: cleanContent,
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
    <div className="w-full max-w-5xl mx-auto pb-10 font-['Lora',serif] animate-fade-in">
      <div className="mb-6 md:mb-8 flex items-center gap-3">
         {/* 🌟 THAY ICON CÂY BÚT */}
         <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shadow-inner">
            <HiPencilAlt className="w-7 h-7" />
         </div>
         <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Viết bài mới</h1>
            <p className="text-slate-500 mt-1 text-sm">Soạn thảo và xuất bản nội dung lên hệ thống.</p>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-8">

        {/* CỘT CHỌN CHUYÊN MỤC */}
        <div>
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">BƯỚC 1: Chọn chuyên mục</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className={`flex-1 cursor-pointer border-2 rounded-xl p-4 transition-all ${category === 'TIN_TUC' ? 'border-amber-500 bg-amber-50 shadow-md shadow-amber-100/50' : 'border-slate-100 hover:border-slate-300'}`}>
              <input type="radio" className="hidden" checked={category === 'TIN_TUC'} onChange={() => setCategory('TIN_TUC')} />
              <div className={`font-bold text-sm md:text-base text-center sm:text-left flex items-center justify-center sm:justify-start gap-3 ${category === 'TIN_TUC' ? 'text-amber-800' : 'text-slate-700'}`}>
                 <HiSpeakerphone className={`w-7 h-7 ${category === 'TIN_TUC' ? 'text-amber-600' : 'text-slate-400'}`} />
                 Tin tức - Sự kiện
              </div>
            </label>

            <label className={`flex-1 cursor-pointer border-2 rounded-xl p-4 transition-all ${category === 'HOC_TAP_BAC' ? 'border-purple-500 bg-purple-50 shadow-md shadow-purple-100/50' : 'border-slate-100 hover:border-slate-300'}`}>
              <input type="radio" className="hidden" checked={category === 'HOC_TAP_BAC'} onChange={() => setCategory('HOC_TAP_BAC')} />
              <div className={`font-bold text-sm md:text-base text-center sm:text-left flex items-center justify-center sm:justify-start gap-3 ${category === 'HOC_TAP_BAC' ? 'text-purple-800' : 'text-slate-700'}`}>
                 <HiSparkles className={`w-7 h-7 ${category === 'HOC_TAP_BAC' ? 'text-purple-600' : 'text-slate-400'}`} />
                 Học tập và làm theo Bác
              </div>
            </label>
          </div>
        </div>

        {/* VIẾT TIÊU ĐỀ */}
        <div>
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">BƯỚC 2: Viết tiêu đề</label>
          <input 
             type="text" 
             value={title} 
             onChange={(e) => setTitle(e.target.value)} 
             placeholder="Nhập tiêu đề bài viết..." 
             className="w-full p-4 border border-slate-200 bg-slate-50 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-500 focus:bg-white outline-none transition-all text-lg font-semibold text-slate-800 placeholder-slate-400" 
          />
        </div>

        {/* SOẠN NỘI DUNG */}
        <div>
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">BƯỚC 3: Soạn nội dung</label>
          <div className="h-[400px] sm:h-[500px] md:h-[600px] mb-12">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              className="h-full rounded-xl bg-white overflow-hidden"
              placeholder="Thầy/cô soạn thảo nội dung chi tiết tại đây..."
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 mt-4 flex justify-end">
          <button 
             type="submit" 
             disabled={isLoading} 
             className="w-full md:w-auto py-3.5 px-10 bg-red-600 hover:bg-red-700 text-white text-sm md:text-base font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "ĐANG TẢI LÊN..." : "ĐĂNG BÀI VIẾT"}
          </button>
        </div>
      </form>
    </div>
  );
}