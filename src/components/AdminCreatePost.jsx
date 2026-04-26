import React, { useState, useRef, useMemo } from 'react';
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from '../services/api';
import { HiPencilAlt, HiSpeakerphone, HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';

const Font = Quill.import('attributors/style/font');
Font.whitelist = ['sans-serif', 'serif', 'monospace', 'roboto', 'lora', 'montserrat', 'dancing-script'];
Quill.register(Font, true);

const Align = Quill.import('attributors/style/align');
Quill.register(Align, true);

export default function AdminCreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('TIN_TUC');
  const [isLoading, setIsLoading] = useState(false);
  
  const quillRef = useRef();

  // HÀM UPLOAD ẢNH BẰNG NÚT CLICK
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const toastId = toast.loading('Đang tải ảnh lên Cloud mây...');
      const formData = new FormData();
      formData.append('file', file);
      
      formData.append('upload_preset', 'libhcm_upload');
      const cloudName = 'dxrvv6djz'; 

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        const imageUrl = data.secure_url;

        const editor = quillRef.current.getEditor();
        const range = editor.getSelection();
        editor.insertEmbed(range.index, 'image', imageUrl);
        
        toast.success('Đã chèn ảnh thành công!', { id: toastId });
      } catch (error) {
        console.error("Lỗi tải ảnh:", error);
        toast.error('Lỗi tải ảnh. Vui lòng thử lại!', { id: toastId });
      }
    };
  };

  // 🌟 HÀM XỬ LÝ KHI NHẤN CTRL+V (COPY - PASTE ẢNH)
  const handlePaste = async (e) => {
      const clipboardData = e.clipboardData || window.clipboardData;
      if (!clipboardData || !clipboardData.items) return;

      const items = clipboardData.items;
      for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
              e.preventDefault(); // CHẶN DÁN BASE64 MẶC ĐỊNH
              
              const file = items[i].getAsFile();
              const toastId = toast.loading('Đang tải ảnh Copy-Paste lên Cloud...');
              
              const formData = new FormData();
              formData.append('file', file);
              formData.append('upload_preset', 'libhcm_upload'); 
              const cloudName = 'dxrvv6djz'; 

              try {
                  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                      method: 'POST',
                      body: formData
                  });
                  const data = await res.json();
                  const imageUrl = data.secure_url;

                  const editor = quillRef.current.getEditor();
                  const range = editor.getSelection() || { index: editor.getLength() };
                  editor.insertEmbed(range.index, 'image', imageUrl);
                  
                  toast.success('Dán ảnh thành công!', { id: toastId });
              } catch (error) {
                  console.error("Lỗi dán ảnh:", error);
                  toast.error('Lỗi tải ảnh. Vui lòng thử lại!', { id: toastId });
              }
              break; 
          }
      }
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'font': Font.whitelist }, { 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  const formats = [
    'font', 'size', 'header',
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
    if (!title) return toast.error("Thầy/Cô quên chưa nhập Tiêu đề bài viết ạ!");
    if (!content || content === '<p><br></p>') return toast.error("Thầy/Cô chưa nhập Nội dung bài viết ạ!");

    setIsLoading(true);
    try {
      const cleanContent = cleanWordGarbageBeforeSave(content);
      await api.post('/articles', {
        title: title,
        content: cleanContent,
        category: category
      });

      toast.success("ĐĂNG BÀI THÀNH CÔNG! Bài viết đã được lưu vào hệ thống.");
      setTitle('');
      setContent('');
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 403) {
        toast.error("Lỗi phân quyền: Thầy/cô vui lòng đăng xuất và đăng nhập lại!");
      } else {
        toast.error("Có lỗi xảy ra khi lưu bài viết.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-10 font-['Lora',serif] animate-fade-in">
      <div className="mb-6 md:mb-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shadow-inner">
          <HiPencilAlt className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Viết bài mới</h1>
          <p className="text-slate-500 mt-1 text-sm">Soạn thảo và xuất bản nội dung lên hệ thống.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-8">

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

        <div className="mb-12">
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">BƯỚC 3: Soạn nội dung</label>

          {/* 🌟 GẮN SỰ KIỆN CHẶN CTRL+V VÀO ĐÂY */}
          <div 
            className="relative rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm"
            onPasteCapture={handlePaste} 
          >
            <style dangerouslySetInnerHTML={{
              __html: `
              .quill { display: flex; flex-direction: column; }
              .ql-toolbar { border: none !important; border-bottom: 1px solid #e2e8f0 !important; background-color: #f8fafc; }
              .ql-container { border: none !important; height: 530px !important; font-size: 16px !important; }
              .ql-editor { height: 100%; overflow-y: auto !important; padding: 16px 16px 60px 16px !important; }
              
              .ql-picker.ql-font .ql-picker-label[data-value="roboto"]::before,
              .ql-picker.ql-font .ql-picker-item[data-value="roboto"]::before { content: 'Roboto'; font-family: 'Roboto', sans-serif; }
              .ql-picker.ql-font .ql-picker-label[data-value="lora"]::before,
              .ql-picker.ql-font .ql-picker-item[data-value="lora"]::before { content: 'Lora'; font-family: 'Lora', serif; }
              .ql-picker.ql-font .ql-picker-label[data-value="montserrat"]::before,
              .ql-picker.ql-font .ql-picker-item[data-value="montserrat"]::before { content: 'Montserrat'; font-family: 'Montserrat', sans-serif; }
              .ql-picker.ql-font .ql-picker-label[data-value="dancing-script"]::before,
              .ql-picker.ql-font .ql-picker-item[data-value="dancing-script"]::before { content: 'Nghệ thuật'; font-family: 'Dancing Script', cursive; }
              
              .ql-editor img {
                max-width: 100% !important; max-height: 450px !important; width: auto !important; object-fit: contain !important;
                margin: 2rem auto !important; border-radius: 0.75rem !important; display: block !important; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
              }
              .ql-editor iframe {
                max-width: 100% !important; width: 100% !important; aspect-ratio: 16/9 !important; border-radius: 0.75rem !important; margin: 2rem auto !important;
              }
            `}} />

            <ReactQuill
              ref={quillRef} 
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              className="bg-white"
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