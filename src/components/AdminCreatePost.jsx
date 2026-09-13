import React, { useState, useRef, useMemo, useEffect } from 'react';
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import api from '../services/api';
import {
  HiPencilAlt,
  HiSpeakerphone,
  HiSparkles,
  HiEye,
  HiPhotograph,
  HiTrash,
  HiClock,
  HiCheckCircle,
  HiX,
  HiRefresh
} from 'react-icons/hi';
import toast from 'react-hot-toast';

// Cấu hình Font và Căn lề cho Quill
const Font = Quill.import('attributors/style/font');
Font.whitelist = ['sans-serif', 'serif', 'monospace', 'roboto', 'lora', 'montserrat', 'dancing-script'];
Quill.register(Font, true);

const Align = Quill.import('attributors/style/align');
Quill.register(Align, true);

// Đăng ký Icon Undo / Redo cho Thanh công cụ
const Icons = Quill.import('ui/icons');
Icons['undo'] = `<svg viewBox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon><path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"></path></svg>`;
Icons['redo'] = `<svg viewBox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon><path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"></path></svg>`;

const DRAFT_KEY = 'admin_post_draft_v2';

export default function AdminCreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('TIN_TUC');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Trạng thái bản nháp tự động
  const [savedDraft, setSavedDraft] = useState(null);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  // Trạng thái Xem trước (Live Preview Modal)
  const [showPreview, setShowPreview] = useState(false);

  const quillRef = useRef();
  const fileInputRef = useRef();

  // 1. Kiểm tra bản nháp cũ khi vừa vào trang
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && (parsed.title || (parsed.content && parsed.content !== '<p><br></p>'))) {
          setSavedDraft(parsed);
          setShowDraftBanner(true);
        }
      }
    } catch (e) {
      console.warn("Không thể đọc bản nháp:", e);
    }
  }, []);

  // 2. Tự động lưu nháp sau khi người dùng gõ (debounce 1.5 giây)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title.trim() || (content && content !== '<p><br></p>')) {
        const draftData = {
          title,
          content,
          category,
          thumbnailUrl,
          savedAt: new Date().toISOString()
        };
        try {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
          setLastSavedTime(new Date());
        } catch (e) {
          console.warn("Lưu nháp thất bại (bộ nhớ đầy):", e);
        }
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [title, content, category, thumbnailUrl]);

  // Khôi phục bản nháp
  const handleRestoreDraft = () => {
    if (!savedDraft) return;
    setTitle(savedDraft.title || '');
    setContent(savedDraft.content || '');
    setCategory(savedDraft.category || 'TIN_TUC');
    setThumbnailUrl(savedDraft.thumbnailUrl || '');
    setShowDraftBanner(false);
    toast.success("Đã khôi phục bản nháp gần nhất!");
  };

  // Bỏ qua / Xóa bản nháp
  const handleDiscardDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setSavedDraft(null);
    setShowDraftBanner(false);
    toast("Đã xóa bản nháp cũ.", { icon: '🗑️' });
  };

  // Upload ảnh lên Cloudinary
  const uploadImageFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'libhcm_upload');
    const cloudName = 'dxrvv6djz';

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error("Upload Cloudinary thất bại");
    const data = await res.json();
    return data.secure_url;
  };

  // HÀM UPLOAD ẢNH CHO NỘI DUNG BÀI VIẾT (CLICK ICON ẢNH TRÊN TOOLBAR)
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const toastId = toast.loading('Đang tải ảnh lên Cloudinary...');
      try {
        const imageUrl = await uploadImageFile(file);
        const editor = quillRef.current.getEditor();
        const range = editor.getSelection() || { index: editor.getLength() };
        editor.insertEmbed(range.index, 'image', imageUrl);

        // Nếu chưa có ảnh đại diện thì tự động gợi ý lấy luôn ảnh này
        if (!thumbnailUrl) {
          setThumbnailUrl(imageUrl);
        }

        toast.success('Đã chèn ảnh vào nội dung thành công!', { id: toastId });
      } catch (error) {
        console.error("Lỗi tải ảnh:", error);
        toast.error('Lỗi tải ảnh. Vui lòng thử lại!', { id: toastId });
      }
    };
  };

  // HÀM UPLOAD RIÊNG ẢNH ĐẠI DIỆN (THUMBNAIL)
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingThumbnail(true);
    const toastId = toast.loading('Đang tải ảnh đại diện lên Cloudinary...');
    try {
      const url = await uploadImageFile(file);
      setThumbnailUrl(url);
      toast.success('Đã đặt ảnh đại diện thành công!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải ảnh đại diện.', { id: toastId });
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  // HÀM XỬ LÝ KHI NHẤN CTRL+V (COPY - PASTE ẢNH TỪ BỘ NHỚ TẠM)
  const handlePaste = async (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData || !clipboardData.items) return;

    const items = clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault(); // Chặn paste Base64

        const file = items[i].getAsFile();
        const toastId = toast.loading('Đang tải ảnh dán lên Cloudinary...');

        try {
          const imageUrl = await uploadImageFile(file);
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection() || { index: editor.getLength() };
          editor.insertEmbed(range.index, 'image', imageUrl);

          if (!thumbnailUrl) setThumbnailUrl(imageUrl);
          toast.success('Dán ảnh thành công!', { id: toastId });
        } catch (error) {
          console.error("Lỗi dán ảnh:", error);
          toast.error('Lỗi tải ảnh dán. Vui lòng thử lại!', { id: toastId });
        }
        break;
      }
    }
  };

  // Thanh công cụ ReactQuill mở rộng với Undo / Redo
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        ['undo', 'redo'],
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
        image: imageHandler,
        undo: function () {
          this.quill.history.undo();
        },
        redo: function () {
          this.quill.history.redo();
        }
      }
    },
    history: {
      delay: 1000,
      maxStack: 100,
      userOnly: true
    }
  }), []);

  const formats = [
    'font', 'size', 'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'color', 'background', 'script',
    'list', 'indent', 'align',
    'link', 'image', 'video', 'code-block'
  ];

  // Thống kê số từ, ký tự và thời gian đọc ước tính
  const stats = useMemo(() => {
    if (!content) return { words: 0, chars: 0, readMinutes: 1 };
    const plainText = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    const words = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
    const chars = plainText.length;
    const readMinutes = Math.max(1, Math.ceil(words / 200)); // Trung bình 200 từ/phút
    return { words, chars, readMinutes };
  }, [content]);

  // Làm sạch rác Microsoft Word trước khi lưu
  const cleanWordGarbageBeforeSave = (rawHtml) => {
    if (!rawHtml) return "";
    return rawHtml
      .replace(/word-break\s*:\s*[^;"]+;?/gi, '')
      .replace(/text-align\s*:\s*justify;?/gi, 'text-align: left;')
      .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')
      .replace(/class="Mso[^"]*"/gi, '');
  };

  // ĐĂNG BÀI VIẾT
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim()) return toast.error("Thầy/Cô vui lòng nhập Tiêu đề bài viết!");
    if (!content || content === '<p><br></p>') return toast.error("Thầy/Cô chưa nhập Nội dung bài viết!");

    setIsLoading(true);
    try {
      let finalContent = cleanWordGarbageBeforeSave(content);

      // Nếu người dùng có chọn ảnh thumbnail riêng biệt và trong bài chưa có ảnh đó,
      // chèn thẻ ảnh này vào đầu nội dung để backend tự bốc làm thumbnail chuẩn xác
      if (thumbnailUrl && !finalContent.includes(thumbnailUrl)) {
        finalContent = `<p><img src="${thumbnailUrl}" alt="${title}" /></p>` + finalContent;
      }

      await api.post('/articles', {
        title: title.trim(),
        content: finalContent,
        category: category
      });

      toast.success("XUẤT BẢN THÀNH CÔNG! Bài viết đã được lưu và hiển thị trực tiếp.");

      // Xóa bản nháp sau khi xuất bản thành công
      localStorage.removeItem(DRAFT_KEY);
      setTitle('');
      setContent('');
      setThumbnailUrl('');
      setShowPreview(false);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 403) {
        toast.error("Hết phiên làm việc: Vui lòng đăng nhập lại tài khoản Admin!");
      } else {
        toast.error("Có lỗi xảy ra khi lưu bài viết.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-12 font-['Lora',serif] animate-fade-in">

      {/* TIÊU ĐỀ TRANG ADMIN */}
      <div className="mb-6 md:mb-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shadow-inner">
            <HiPencilAlt className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Soạn thảo & Đăng bài</h1>
            <p className="text-slate-500 mt-0.5 text-xs sm:text-sm font-sans">
              Hệ thống xuất bản tin tức và chuyên đề Không gian Văn hóa Hồ Chí Minh
            </p>
          </div>
        </div>

        {/* NÚT XEM TRƯỚC VÀ XUẤT BẢN NHANH */}
        <div className="flex items-center gap-2.5 font-sans">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="px-4 py-2.5 bg-white border border-stone-300 hover:border-red-500 text-stone-700 hover:text-red-700 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <HiEye className="w-4 h-4 text-red-600" />
            Xem trước
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Đang xuất bản..." : "Đăng bài ngay"}
          </button>
        </div>
      </div>

      {/* BANNER THÔNG BÁO KHÔI PHỤC BẢN NHÁP CŨ NẾU CÓ */}
      {showDraftBanner && savedDraft && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4 font-sans text-xs sm:text-sm animate-fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xl">📝</span>
            <div>
              <p className="font-bold text-amber-900">
                Phát hiện bản nháp chưa xuất bản: "{savedDraft.title || 'Bài viết chưa đặt tên'}"
              </p>
              <p className="text-amber-700 text-xs mt-0.5">
                Lưu lần cuối lúc {savedDraft.savedAt ? new Date(savedDraft.savedAt).toLocaleTimeString('vi-VN') + ' - ' + new Date(savedDraft.savedAt).toLocaleDateString('vi-VN') : 'vừa rồi'}. Bạn có muốn tiếp tục soạn thảo không?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRestoreDraft}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
            >
              Khôi phục
            </button>
            <button
              onClick={handleDiscardDraft}
              className="px-3 py-1.5 bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 font-bold rounded-lg transition-colors cursor-pointer"
            >
              Bỏ qua
            </button>
          </div>
        </div>
      )}

      {/* BIỂU MẪU CHÍNH */}
      <form onSubmit={handleSubmit} className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-7">

        {/* BƯỚC 1: CHUYÊN MỤC */}
        <div>
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
            BƯỚC 1: Chọn chuyên mục
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className={`flex-1 cursor-pointer border-2 rounded-xl p-4 transition-all ${category === 'TIN_TUC' ? 'border-red-600 bg-red-50/60 shadow-sm' : 'border-slate-100 hover:border-slate-300'}`}>
              <input type="radio" className="hidden" checked={category === 'TIN_TUC'} onChange={() => setCategory('TIN_TUC')} />
              <div className={`font-bold text-sm md:text-base flex items-center gap-3 ${category === 'TIN_TUC' ? 'text-red-800' : 'text-slate-700'}`}>
                <HiSpeakerphone className={`w-6 h-6 ${category === 'TIN_TUC' ? 'text-red-600' : 'text-slate-400'}`} />
                Tin tức
              </div>
              <p className="text-xs text-slate-500 font-sans mt-1.5 ml-9">Các sự kiện, phong trào, hoạt động diễn ra trong nhà trường</p>
            </label>

            <label className={`flex-1 cursor-pointer border-2 rounded-xl p-4 transition-all ${category === 'HOC_TAP_BAC' ? 'border-amber-600 bg-amber-50/60 shadow-sm' : 'border-slate-100 hover:border-slate-300'}`}>
              <input type="radio" className="hidden" checked={category === 'HOC_TAP_BAC'} onChange={() => setCategory('HOC_TAP_BAC')} />
              <div className={`font-bold text-sm md:text-base flex items-center gap-3 ${category === 'HOC_TAP_BAC' ? 'text-amber-800' : 'text-slate-700'}`}>
                <HiSparkles className={`w-6 h-6 ${category === 'HOC_TAP_BAC' ? 'text-amber-600' : 'text-slate-400'}`} />
                Học tập & Làm theo Bác
              </div>
              <p className="text-xs text-slate-500 font-sans mt-1.5 ml-9">Các bài học, tấm gương, tư liệu về đạo đức và tư tưởng Hồ Chí Minh</p>
            </label>
          </div>
        </div>

        {/* BƯỚC 2: TIÊU ĐỀ */}
        <div>
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
            BƯỚC 2: Tiêu đề bài viết
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề trang trọng, rõ nghĩa..."
            className="w-full p-4 border border-slate-200 bg-slate-50 rounded-xl focus:ring-2 focus:ring-red-100 focus:border-red-500 focus:bg-white outline-none transition-all text-base sm:text-lg font-bold text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* BƯỚC 3: ẢNH ĐẠI DIỆN RIÊNG BIỆT (THUMBNAIL) */}
        <div>
          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
            BƯỚC 3: Ảnh đại diện bài viết (Thumbnail)
          </label>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50/70">
            {thumbnailUrl ? (
              <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-slate-200 shadow-xs shrink-0 group">
                <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setThumbnailUrl('')}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                  title="Xóa ảnh đại diện này"
                >
                  <HiTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="w-40 h-24 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 shrink-0 bg-white">
                <HiPhotograph className="w-7 h-7 mb-1 text-slate-300" />
                <span className="text-[11px] font-sans">Chưa có ảnh</span>
              </div>
            )}

            <div className="flex-1 font-sans text-xs">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
              />
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <button
                  type="button"
                  disabled={isUploadingThumbnail}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-white border border-slate-300 hover:border-red-500 text-slate-700 hover:text-red-700 font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <HiPhotograph className="w-4 h-4 text-red-600" />
                  {thumbnailUrl ? "Thay đổi ảnh đại diện" : "Tải ảnh đại diện lên Cloudinary"}
                </button>
                {thumbnailUrl && (
                  <button
                    type="button"
                    onClick={() => setThumbnailUrl('')}
                    className="px-3 py-1.5 text-red-600 hover:text-red-700 font-medium transition-colors cursor-pointer"
                  >
                    Bỏ ảnh riêng
                  </button>
                )}
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                {thumbnailUrl
                  ? "✓ Đã chọn ảnh đại diện riêng cho bài viết."
                  : "Nếu không tải ảnh riêng ở đây, hệ thống sẽ tự động dùng bức ảnh đầu tiên trong nội dung bài viết làm ảnh đại diện."}
              </p>
            </div>
          </div>
        </div>

        {/* BƯỚC 4: TRÌNH SOẠN THẢO NỘI DUNG */}
        <div>
          <div className="flex items-center justify-between mb-2 ml-1">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest">
              BƯỚC 4: Soạn nội dung bài viết
            </label>

            {/* Trạng thái lưu nháp thời gian thực */}
            {lastSavedTime && (
              <span className="text-[11px] font-sans text-emerald-600 font-medium flex items-center gap-1">
                <HiCheckCircle className="w-3.5 h-3.5" />
                Đã tự động lưu nháp lúc {lastSavedTime.toLocaleTimeString('vi-VN')}
              </span>
            )}
          </div>

          <div
            className="relative rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs"
            onPasteCapture={handlePaste}
          >
            <style dangerouslySetInnerHTML={{
              __html: `
              .quill { display: flex; flex-direction: column; }
              .ql-toolbar { border: none !important; border-bottom: 1px solid #e2e8f0 !important; background-color: #f8fafc; padding: 10px !important; }
              .ql-container { border: none !important; min-height: 480px !important; font-size: 16px !important; }
              .ql-editor { min-height: 480px; overflow-y: auto !important; padding: 20px !important; line-height: 1.8; font-family: 'Lora', serif; }
              
              .ql-picker.ql-font .ql-picker-label[data-value="roboto"]::before,
              .ql-picker.ql-font .ql-picker-item[data-value="roboto"]::before { content: 'Roboto'; font-family: 'Roboto', sans-serif; }
              .ql-picker.ql-font .ql-picker-label[data-value="lora"]::before,
              .ql-picker.ql-font .ql-picker-item[data-value="lora"]::before { content: 'Lora'; font-family: 'Lora', serif; }
              .ql-picker.ql-font .ql-picker-label[data-value="montserrat"]::before,
              .ql-picker.ql-font .ql-picker-item[data-value="montserrat"]::before { content: 'Montserrat'; font-family: 'Montserrat', sans-serif; }
              .ql-picker.ql-font .ql-picker-label[data-value="dancing-script"]::before,
              .ql-picker.ql-font .ql-picker-item[data-value="dancing-script"]::before { content: 'Nghệ thuật'; font-family: 'Dancing Script', cursive; }
              
              .ql-editor img {
                max-width: 100% !important; max-height: 480px !important; width: auto !important; object-fit: contain !important;
                margin: 1.75rem auto !important; border-radius: 0.75rem !important; display: block !important; box-shadow: 0 4px 12px -2px rgb(0 0 0 / 0.12) !important;
              }
              .ql-editor iframe {
                max-width: 100% !important; width: 100% !important; aspect-ratio: 16/9 !important; border-radius: 0.75rem !important; margin: 1.75rem auto !important;
              }
              .ql-editor blockquote {
                border-left: 4px solid #dc2626 !important; padding-left: 1rem !important; color: #4b5563 !important; font-style: italic !important; background: #fef2f2/40;
              }
              /* Triệt tiêu hoàn toàn lỗi chồng lấn chữ của placeholder */
              .ql-editor::before { display: none !important; }
              .ql-editor.ql-blank::before { display: none !important; }
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

            {/* THANH THỐNG KÊ SỐ TỪ VÀ THỜI GIAN ĐỌC (DƯỚI CHÂN TRÌNH SOẠN THẢO) */}
            <div className="border-t border-slate-100 px-4 py-2 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-sans flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <span>📝 <strong>{stats.words}</strong> từ</span>
                <span>🔤 <strong>{stats.chars}</strong> ký tự</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Mẹo: Bấm <strong>Ctrl + Z</strong> (hoặc icon ↶) để hoàn tác, <strong>Ctrl + V</strong> để dán ảnh
              </span>
            </div>
          </div>
        </div>

        {/* NÚT HOÀN TẤT & ĐĂNG BÀI */}
        <div className="border-t border-slate-100 pt-6 flex items-center justify-between flex-wrap gap-4 font-sans">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <HiEye className="w-4 h-4 text-slate-600" />
            Xem trước giao diện
          </button>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="py-3.5 px-8 bg-red-600 hover:bg-red-700 text-white text-sm md:text-base font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <HiPencilAlt className="w-5 h-5" />
              {isLoading ? "ĐANG XUẤT BẢN..." : "XUẤT BẢN BÀI VIẾT"}
            </button>
          </div>
        </div>
      </form>

      {/* ========================================================= */}
      {/* 🌟 MODAL XEM TRƯỚC BÀI VIẾT (LIVE PREVIEW MODAL)         */}
      {/* ========================================================= */}
      {showPreview && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#fcf9f2] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col border border-stone-300">

            {/* Thanh tiêu đề Modal */}
            <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between shrink-0 font-sans">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-bold text-sm">Chế độ Xem trước bài viết</span>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Nội dung bài đọc mô phỏng đúng ArticleDetail */}
            <div className="p-6 sm:p-10 overflow-y-auto font-['Lora',serif]">

              {/* Tag Chuyên mục */}
              <div className="mb-3">
                <span className="text-xs font-bold text-red-700 uppercase tracking-widest">
                  {category === 'TIN_TUC' ? 'TIN TỨC' : 'HỌC TẬP & LÀM THEO BÁC'}
                </span>
              </div>

              {/* Tiêu đề bài viết */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 leading-tight mb-4">
                {title || 'Chưa có tiêu đề bài viết'}
              </h1>

              {/* Tác giả & Ngày giờ */}
              <div className="flex items-center gap-3 text-xs text-stone-500 font-sans border-b border-stone-200 pb-4 mb-6">
                <span>Đăng lúc: <strong>{new Date().toLocaleTimeString('vi-VN')} | {new Date().toLocaleDateString('vi-VN')}</strong></span>
                <span>•</span>
                <span>Tác giả: <strong>Ban Biên Tập</strong></span>
                <span>•</span>
                <span>⏱️ {stats.readMinutes} phút đọc</span>
              </div>

              {/* Ảnh đại diện nếu có */}
              {thumbnailUrl && (
                <div className="mb-6 rounded-2xl overflow-hidden shadow-md max-h-[420px] bg-stone-100">
                  <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Nội dung chi tiết */}
              <div
                className="prose prose-lg max-w-none text-stone-800 leading-relaxed font-['Lora',serif]"
                dangerouslySetInnerHTML={{ __html: content || '<p className="italic text-stone-400">Nội dung bài viết đang trống...</p>' }}
              />
            </div>

            {/* Chân Modal: Nút hành động */}
            <div className="bg-white px-6 py-4 border-t border-stone-200 flex items-center justify-between shrink-0 font-sans">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-colors cursor-pointer"
              >
                ← Quay lại chỉnh sửa
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoading ? "Đang xuất bản..." : "Đồng ý & Xuất bản ngay"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}