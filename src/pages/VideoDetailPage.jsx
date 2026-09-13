import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { videosList, videoCategories } from '../data/videos';

function VideoDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState('Tất cả');
    const [copied, setCopied] = useState(false);

    // Cuộn mượt lên đầu trang khi mở video
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    // Lấy video hiện tại (mặc định lấy video đầu tiên nếu id không khớp)
    const currentVideo = useMemo(() => {
        const parsedId = parseInt(id, 10);
        return videosList.find((v) => v.id === parsedId) || videosList[0];
    }, [id]);

    // Danh sách các video khác (loại bỏ video đang phát)
    const relatedVideos = useMemo(() => {
        return videosList.filter((v) => v.id !== currentVideo.id);
    }, [currentVideo.id]);

    // Lọc theo thể loại
    const filteredVideos = useMemo(() => {
        if (selectedCategory === 'Tất cả') return relatedVideos;
        return relatedVideos.filter((v) => v.category === selectedCategory);
    }, [relatedVideos, selectedCategory]);

    // Sao chép liên kết video
    const handleCopyLink = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-[#fcf9f2] py-6 sm:py-8 px-3 sm:px-6 lg:px-8 font-sans selection:bg-red-200 text-stone-800">
            <div className="max-w-7xl mx-auto bg-white p-5 sm:p-7 md:p-9 rounded-2xl shadow-xs border border-stone-200/80">

                {/* TIÊU ĐỀ MỤC & NÚT QUAY LẠI GÓC TRÁI (GỌN GÀNG, KHÔNG BỊ TRỐNG THỪA) */}
                <div className="flex items-center justify-between border-b-[3px] border-red-700 pb-3 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs group active:scale-95"
                            title="Quay lại trang trước"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Quay lại<span className="hidden sm:inline"> trang trước</span></span>
                        </button>

                        <div className="h-5 w-px bg-stone-300"></div>

                        <h2 className="text-xl sm:text-2xl font-['Lora',serif] font-bold text-red-700 uppercase tracking-wide">
                            Tư liệu Video
                        </h2>
                    </div>
                </div>

                {/* KHU VỰC PHÁT VIDEO CHÍNH (CHIA CỘT 8 - 4 THEO ĐÚNG BỐ CỤC BAN ĐẦU) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-12 sm:mb-16 items-start">

                    {/* CỘT TRÁI (8 CỘT): MÀN HÌNH VIDEO */}
                    <div className="lg:col-span-8">
                        <div className="relative w-full aspect-video bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-stone-300">
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1&rel=0`}
                                title={currentVideo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>

                    {/* CỘT PHẢI (4 CỘT): THÔNG TIN CHI TIẾT VIDEO */}
                    <div className="lg:col-span-4 flex flex-col justify-start space-y-4">

                        {/* Thể loại & Thời lượng */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-800 border border-red-200/60 uppercase tracking-wide">
                                {currentVideo.category || 'Tư liệu lịch sử'}
                            </span>
                            {currentVideo.duration && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium text-stone-600 bg-stone-100 border border-stone-200/60">
                                    ⏱ {currentVideo.duration}
                                </span>
                            )}
                        </div>

                        {/* Tiêu đề video chính */}
                        <h1 className="text-lg sm:text-xl md:text-2xl font-['Lora',serif] font-bold text-stone-900 leading-snug">
                            {currentVideo.title}
                        </h1>

                        {/* Bảng thông số: Nguồn & Lượt xem rõ ràng */}
                        <div className="text-stone-600 text-xs sm:text-[13px] space-y-2.5 py-3 border-y border-stone-100">
                            <p className="flex items-center justify-between">
                                <span className="font-semibold text-stone-700">Nguồn tư liệu:</span>
                                <span className="text-stone-900 font-medium">{currentVideo.source || 'hochiminh.vn'}</span>
                            </p>
                            <p className="flex items-center justify-between">
                                <span className="font-semibold text-stone-700">Lượt xem:</span>
                                <span className="text-red-700 font-mono font-semibold">{currentVideo.views || '120,000'} lượt</span>
                            </p>
                        </div>

                        {/* Tóm lược nội dung bối cảnh ngắn gọn */}
                        {currentVideo.summary && (
                            <p className="text-xs text-stone-600 leading-relaxed font-serif italic bg-[#fbf9f4] p-3 rounded-xl border border-stone-200/60">
                                "{currentVideo.summary}"
                            </p>
                        )}

                        {/* Cụm nút tiện ích: Chia sẻ, Mở YouTube */}
                        <div className="pt-2 flex flex-wrap items-center gap-2.5">
                            <button
                                onClick={handleCopyLink}
                                className="flex items-center gap-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                                title="Sao chép liên kết video"
                            >
                                {copied ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-emerald-700 font-bold">Đã chép link</span>
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                        <span>Chia sẻ</span>
                                    </>
                                )}
                            </button>

                            <a
                                href={`https://www.youtube.com/watch?v=${currentVideo.youtubeId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
                                title="Xem trên YouTube"
                            >
                                <svg className="h-3.5 w-3.5 fill-current text-red-600" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                                <span>YouTube</span>
                            </a>
                        </div>

                    </div>

                </div>

                {/* TIÊU ĐỀ MỤC: TƯ LIỆU VIDEO KHÁC + BỘ LỌC THỂ LOẠI */}
                <div className="border-b-[3px] border-red-700 pb-2.5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h2 className="text-lg sm:text-xl font-['Lora',serif] font-bold text-red-700 uppercase tracking-wide">
                        Tư liệu Video Khác
                    </h2>

                    {/* Bộ lọc danh mục nhỏ gọn, tinh tế */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
                        {videoCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${selectedCategory === cat
                                        ? 'bg-red-700 text-white shadow-xs'
                                        : 'bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200/60'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* LƯỚI 4 CỘT (TRÊN MÁY TÍNH), 3 CỘT (TABLET), 2 CỘT (ĐIỆN THOẠI) THEO ĐÚNG LAYOUT GỐC */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 mb-8">
                    {filteredVideos.map((video) => (
                        <Link
                            to={`/video/${video.id}`}
                            key={video.id}
                            className="group cursor-pointer flex flex-col bg-white rounded-xl hover:shadow-xl transition-all duration-300 border border-stone-200/80 hover:border-red-600/40 overflow-hidden hover:-translate-y-1"
                        >
                            {/* Khung hình Thumbnail 16:9 sắc nét */}
                            <div className="relative w-full aspect-video bg-stone-900 overflow-hidden border-b border-stone-100">
                                <img
                                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                                    alt={video.title}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = "/anh-bac-Ho.jpg";
                                    }}
                                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                                />

                                {/* Nút Play đỏ tròn giữa khung hình */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/15 group-hover:bg-black/35 transition-colors">
                                    <div className="bg-red-700 text-white rounded-full p-2.5 shadow-md transform group-hover:scale-115 group-hover:bg-red-600 transition-all duration-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Badge thời lượng góc dưới */}
                                {video.duration && (
                                    <span className="absolute bottom-1.5 right-1.5 bg-black/80 font-mono text-white text-[10px] px-1.5 py-0.5 rounded">
                                        {video.duration}
                                    </span>
                                )}

                                {/* Badge thể loại góc trên */}
                                {video.category && (
                                    <span className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
                                        {video.category}
                                    </span>
                                )}
                            </div>

                            {/* Phần thông tin thẻ video */}
                            <div className="p-4 flex flex-col justify-between flex-1 gap-2.5">
                                <h3 className="font-['Lora',serif] font-bold text-[14px] text-stone-800 group-hover:text-red-700 transition-colors leading-snug line-clamp-2">
                                    {video.title}
                                </h3>

                                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100 font-sans">
                                    <span className="truncate max-w-[120px] font-medium text-stone-600">
                                        {video.source || 'hochiminh.vn'}
                                    </span>
                                    <span className="font-mono text-stone-500">
                                        {video.views || '50,000'} lượt xem
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default VideoDetailPage;