import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import api from '../services/api';
import toast from 'react-hot-toast';
import { HiPencilAlt } from 'react-icons/hi';

// 🌟 ĐĂNG KÝ FONT CHỮ MỚI & ÉP QUILL DÙNG INLINE STYLE
const Font = Quill.import('attributors/style/font');
Font.whitelist = ['sans-serif', 'serif', 'monospace', 'roboto', 'lora', 'montserrat', 'dancing-script'];
Quill.register(Font, true);

const Align = Quill.import('attributors/style/align');
Quill.register(Align, true);

export default function AdminEditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('TIN_TUC');
    const [content, setContent] = useState('');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await api.get(`/articles/${id}`);
                const article = res.data;
                setTitle(article.title);
                setCategory(article.category);
                setContent(article.content);
            } catch (error) {
                toast.error("Lỗi không tìm thấy bài viết!");
                navigate('/admin/articles');
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id, navigate]);

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
        if (!title || !content || content === '<p><br></p>') {
            toast.error("Vui lòng nhập đầy đủ Tiêu đề và Nội dung!");
            return;
        }

        setSaving(true);
        try {
            const cleanContent = cleanWordGarbageBeforeSave(content);
            await api.put(`/articles/${id}`, {
                title,
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

    // 🌟 MỞ RỘNG THANH CÔNG CỤ (FULL OPTION)
    const modules = {
        toolbar: [
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
    };

    const formats = [
        'font', 'size', 'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'color', 'background', 'script',
        'list', 'indent', 'align',
        'link', 'image', 'video', 'code-block'
    ];

    if (loading) return (
        <div className="flex h-[50vh] items-center justify-center">
            <div className="animate-pulse text-lg font-bold font-['Lora',serif] text-slate-400 tracking-widest uppercase">Đang tải dữ liệu bài viết...</div>
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto pb-10 font-['Lora',serif] animate-fade-in">
            <div className="mb-6 md:mb-8 flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shadow-inner">
                    <HiPencilAlt className="w-7 h-7" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Chỉnh sửa bài viết</h1>
                    <p className="text-slate-500 mt-1 text-sm">Đang cập nhật nội dung cho bài viết #{id}</p>
                </div>
            </div>

            <div className="bg-white p-5 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <label className="block text-[11px] font-black font-['Lora',serif] text-slate-400 uppercase tracking-widest mb-2 ml-1">Tiêu đề bài viết</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all font-semibold text-slate-800 text-lg"
                                placeholder="Nhập tiêu đề..."
                            />
                        </div>

                        <div className="w-full md:w-72">
                            <label className="block text-[11px] font-black font-['Lora',serif] text-slate-400 uppercase tracking-widest mb-2 ml-1">Chuyên mục</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-3.5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all cursor-pointer font-bold text-slate-700"
                            >
                                <option value="TIN_TUC">Tin tức - Sự kiện</option>
                                <option value="HOC_TAP_BAC">Học tập & Làm theo Bác</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-12">
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">BƯỚC 3: Soạn nội dung</label>

                        <div className="relative rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                            <style dangerouslySetInnerHTML={{
                                __html: `
              .quill { display: flex; flex-direction: column; }
              .ql-toolbar { border: none !important; border-bottom: 1px solid #e2e8f0 !important; background-color: #f8fafc; }
              .ql-container { border: none !important; height: 530px !important; font-size: 16px !important; }
              .ql-editor { height: 100%; overflow-y: auto !important; padding: 16px 16px 60px 16px !important; }
              
              /* CSS ĐỂ HIỂN THỊ TÊN FONT CHỮ TRONG MENU DROPDOWN */
              .ql-picker.ql-font .ql-picker-label[data-value="roboto"]::before,
              .ql-picker.ql-font .ql-picker-item[data-value="roboto"]::before { content: 'Roboto'; font-family: 'Roboto', sans-serif; }
              .ql-picker.ql-font .ql-picker-label[data-value="lora"]::before,
              .ql-picker.ql-font .ql-picker-item[data-value="lora"]::before { content: 'Lora'; font-family: 'Lora', serif; }
              .ql-picker.ql-font .ql-picker-label[data-value="montserrat"]::before,
              .ql-picker.ql-font .ql-picker-item[data-value="montserrat"]::before { content: 'Montserrat'; font-family: 'Montserrat', sans-serif; }
              .ql-picker.ql-font .ql-picker-label[data-value="dancing-script"]::before,
              .ql-picker.ql-font .ql-picker-item[data-value="dancing-script"]::before { content: 'Nghệ thuật'; font-family: 'Dancing Script', cursive; }
            `}} />

                            <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={modules}
                                formats={formats}
                                className="bg-white"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/articles')}
                            className="px-8 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className={`flex-1 px-6 py-3.5 text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-md ${saving ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5'}`}
                        >
                            {saving ? 'ĐANG LƯU THAY ĐỔI...' : 'CẬP NHẬT BÀI VIẾT'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}