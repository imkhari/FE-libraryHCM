import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
    HiPencilAlt, 
    HiEye, 
    HiPhotograph, 
    HiTrash, 
    HiClock, 
    HiX 
} from 'react-icons/hi';

const Font = Quill.import('attributors/style/font');
Font.whitelist = ['sans-serif', 'serif', 'monospace', 'roboto', 'lora', 'montserrat', 'dancing-script'];
Quill.register(Font, true);

const Align = Quill.import('attributors/style/align');
Quill.register(Align, true);

const Icons = Quill.import('ui/icons');
Icons['undo'] = `<svg viewBox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10"></polygon><path class="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"></path></svg>`;
Icons['redo'] = `<svg viewBox="0 0 18 18"><polygon class="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10"></polygon><path class="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"></path></svg>`;

export default function AdminEditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('TIN_TUC');
    const [content, setContent] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    
    const quillRef = useRef();
    const fileInputRef = useRef();

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await api.get(`/articles/${id}`);
                const article = res.data;
                setTitle(article.title || '');
                setCategory(article.category || 'TIN_TUC');
                setContent(article.content || '');
                setThumbnailUrl(article.thumbnailUrl || '');
            } catch (error) {
                toast.error("Lỗi không tìm thấy bài viết!");
                navigate('/admin/articles');
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id, navigate]);

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

    // HÀM UPLOAD ẢNH BẰNG NÚT CLICK TRÊN TOOLBAR
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
                
                if (!thumbnailUrl) setThumbnailUrl(imageUrl);
                toast.success('Đã chèn ảnh vào bài viết!', { id: toastId });
            } catch (error) {
                console.error("Lỗi tải ảnh:", error);
                toast.error('Lỗi tải ảnh. Vui lòng thử lại!', { id: toastId });
            }
        };
    };

    // HÀM UPLOAD RIÊNG ẢNH ĐẠI DIỆN
    const handleThumbnailUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingThumbnail(true);
        const toastId = toast.loading('Đang tải ảnh đại diện lên Cloudinary...');
        try {
            const url = await uploadImageFile(file);
            setThumbnailUrl(url);
            toast.success('Đã cập nhật ảnh đại diện!', { id: toastId });
        } catch (err) {
            console.error(err);
            toast.error('Không thể tải ảnh đại diện.', { id: toastId });
        } finally {
            setIsUploadingThumbnail(false);
        }
    };

    // HÀM XỬ LÝ KHI NHẤN CTRL+V (COPY - PASTE ẢNH TỪ CLIPBOARD)
    const handlePaste = async (e) => {
        const clipboardData = e.clipboardData || window.clipboardData;
        if (!clipboardData || !clipboardData.items) return;

        const items = clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf("image") !== -1) {
                e.preventDefault();
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
                    toast.error('Lỗi tải ảnh. Vui lòng thử lại!', { id: toastId });
                }
                break;
            }
        }
    };

    const cleanWordGarbageBeforeSave = (rawHtml) => {
        if (!rawHtml) return "";
        return rawHtml
            .replace(/word-break\s*:\s*[^;"]+;?/gi, '')
            .replace(/text-align\s*:\s*justify;?/gi, 'text-align: left;')
            .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')
            .replace(/class="Mso[^"]*"/gi, '');
    };

    // Thống kê số từ, ký tự và thời gian đọc ước tính
    const stats = useMemo(() => {
        if (!content) return { words: 0, chars: 0, readMinutes: 1 };
        const plainText = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
        const words = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
        const chars = plainText.length;
        const readMinutes = Math.max(1, Math.ceil(words / 200));
        return { words, chars, readMinutes };
    }, [content]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!title.trim() || !content || content === '<p><br></p>') {
            toast.error("Vui lòng nhập đầy đủ Tiêu đề và Nội dung!");
            return;
        }

        setSaving(true);
        try {
            let cleanContent = cleanWordGarbageBeforeSave(content);

            // Nếu người dùng có chọn ảnh thumbnail riêng biệt và trong bài chưa có ảnh đó
            if (thumbnailUrl && !cleanContent.includes(thumbnailUrl)) {
                cleanContent = `<p><img src="${thumbnailUrl}" alt="${title}" /></p>` + cleanContent;
            }

            await api.put(`/articles/${id}`, {
                title: title.trim(),
                category,
                content: cleanContent
            });
            toast.success("Cập nhật bài viết thành công!");
            navigate('/admin/articles');
        } catch (error) {
            toast.error("Lỗi khi cập nhật bài viết!");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

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
                undo: function() {
                    this.quill.history.undo();
                },
                redo: function() {
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

    if (loading) return (
        <div className="w-full max-w-5xl mx-auto pb-10 font-['Lora',serif] animate-pulse">
            <div className="mb-6 md:mb-8 flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                <div className="space-y-2">
                    <div className="h-8 bg-slate-200 rounded w-64"></div>
                    <div className="h-4 bg-slate-200 rounded w-48"></div>
                </div>
            </div>

            <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-6">
                <div className="h-14 bg-slate-100 rounded-xl w-full"></div>
                <div className="h-[480px] bg-slate-100 rounded-xl w-full"></div>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto pb-10 font-['Lora',serif] animate-fade-in">
            {/* TIÊU ĐỀ */}
            <div className="mb-6 md:mb-8 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shadow-inner">
                        <HiPencilAlt className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Chỉnh sửa bài viết</h1>
                        <p className="text-slate-500 mt-0.5 text-xs sm:text-sm font-sans">Đang cập nhật nội dung cho bài viết #{id}</p>
                    </div>
                </div>

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
                        disabled={saving}
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {saving ? 'Đang lưu...' : 'Cập nhật'}
                    </button>
                </div>
            </div>

            <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* TIÊU ĐỀ VÀ CHUYÊN MỤC */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Tiêu đề bài viết</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all font-bold text-slate-800 text-base sm:text-lg"
                                placeholder="Nhập tiêu đề..."
                            />
                        </div>

                        <div className="w-full md:w-72">
                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Chuyên mục</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all cursor-pointer font-bold text-slate-700 font-sans"
                            >
                                <option value="TIN_TUC">Tin tức</option>
                                <option value="HOC_TAP_BAC">Học tập & Làm theo Bác</option>
                            </select>
                        </div>
                    </div>

                    {/* ẢNH ĐẠI DIỆN */}
                    <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                            Ảnh đại diện bài viết (Thumbnail)
                        </label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50/70">
                            {thumbnailUrl ? (
                                <div className="relative w-40 h-24 rounded-lg overflow-hidden border border-slate-200 shadow-xs shrink-0 group">
                                    <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setThumbnailUrl('')}
                                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                                        title="Xóa ảnh đại diện"
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
                                <p className="text-slate-500 text-[11px]">
                                    {thumbnailUrl ? "✓ Đã gắn ảnh đại diện." : "Hệ thống sẽ dùng ảnh đầu tiên trong bài viết nếu bạn không tải ảnh riêng ở đây."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SOẠN NỘI DUNG */}
                    <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Soạn nội dung</label>

                        <div 
                            className="relative rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm"
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

                            <div className="border-t border-slate-100 px-4 py-2 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-sans flex-wrap gap-2">
                                <div className="flex items-center gap-4">
                                    <span>📝 <strong>{stats.words}</strong> từ</span>
                                    <span>🔤 <strong>{stats.chars}</strong> ký tự</span>
                                    <span className="flex items-center gap-1">
                                        <HiClock className="w-3.5 h-3.5 text-slate-400" />
                                        Khoảng <strong>{stats.readMinutes}</strong> phút đọc
                                    </span>
                                </div>
                                <span className="text-[11px] text-slate-400">
                                    Mẹo: Bấm <strong>Ctrl + Z</strong> (hoặc icon ↶) để hoàn tác, <strong>Ctrl + V</strong> để dán ảnh
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-6 border-t border-slate-100 font-sans">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/articles')}
                            className="px-6 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
                        >
                            ← Quay lại danh sách
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowPreview(true)}
                            className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
                        >
                            Xem trước
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className={`flex-1 px-8 py-3.5 text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer ${saving ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5'}`}
                        >
                            {saving ? 'ĐANG LƯU THAY ĐỔI...' : 'LƯU VÀ XUẤT BẢN THAY ĐỔI'}
                        </button>
                    </div>
                </form>
            </div>

            {/* MODAL XEM TRƯỚC */}
            {showPreview && (
                <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
                    <div className="bg-[#fcf9f2] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col border border-stone-300">
                        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between shrink-0 font-sans">
                            <span className="font-bold text-sm">Chế độ Xem trước bài viết</span>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer"
                            >
                                <HiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 sm:p-10 overflow-y-auto font-['Lora',serif]">
                            <div className="mb-3">
                                <span className="text-xs font-bold text-red-700 uppercase tracking-widest">
                                    {category === 'TIN_TUC' ? 'TIN TỨC' : 'HỌC TẬP & LÀM THEO BÁC'}
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 leading-tight mb-4">
                                {title || 'Chưa có tiêu đề'}
                            </h1>
                            {thumbnailUrl && (
                                <div className="mb-6 rounded-2xl overflow-hidden shadow-md max-h-[420px] bg-stone-100">
                                    <img src={thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div 
                                className="prose prose-lg max-w-none text-stone-800 leading-relaxed font-['Lora',serif]"
                                dangerouslySetInnerHTML={{ __html: content || '<p className="italic text-stone-400">Chưa có nội dung...</p>' }}
                            />
                        </div>

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
                                disabled={saving}
                                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {saving ? "Đang lưu..." : "Xác nhận cập nhật bài viết"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}