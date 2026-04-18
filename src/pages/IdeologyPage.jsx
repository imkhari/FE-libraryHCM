import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function IdeologyPage() {
    const navigate = useNavigate();
    const { type } = useParams();

    const [contentData, setContentData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Dùng useRef để kiểm soát cờ render, tránh loop không cần thiết
    const isInitialMount = useRef(true);

    const isVangVong = type && (type.includes('vang-vong') || type.includes('non-nuoc'));
    const isTaiLieu = type === 'tai-lieu-hoc-tap';
    const isTrongLong = type === 'trong-long-dan-toc';
    const isPdfSeries = isVangVong || isTaiLieu || isTrongLong;

    let pageTitle = "Sáng mãi niềm tin theo Bác";
    if (isVangVong) {
        pageTitle = "Hồ Chí Minh – Vang vọng lời non nước";
    } else if (isTaiLieu) {
        pageTitle = "Tài liệu học tập làm theo Bác";
    } else if (isTrongLong) {
        pageTitle = "Hồ Chí Minh trong lòng dân tộc và thế giới";
    } else if (type === 've-ho-chi-minh') {
        pageTitle = "Những tác phẩm viết về Hồ Chí Minh";
    }

    // Reset lại trang 1 mỗi khi đổi tab
    useEffect(() => {
        setCurrentPage(1);
    }, [type]);

    // TỰ ĐỘNG CUỘN LÊN ĐẦU KHI CHUYỂN TRANG
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [currentPage]);

    const videosList = [
        { id: 1, youtubeId: "58HGVK6j-80", title: "Hành trình tìm đường cứu nước của Chủ tịch Hồ Chí Minh" },
        { id: 2, youtubeId: "RR0p5Aqrhto", title: "TOÀN CẢNH HÀNH TRÌNH TÌM ĐƯỜNG CỨU NƯỚC" },
        { id: 3, youtubeId: "d5MYTDacTZ4", title: "Hồ Chí Minh - Chân dung một con người" },
        { id: 4, youtubeId: "H5_Hu1ju1QM", title: "Hồ Chí Minh - Một hành trình" },
        { id: 5, youtubeId: "e0CEWmWG79U", title: "Hồ Chí Minh – Dấu chân đầu tiên" },
        { id: 6, youtubeId: "VzpimJtKfnE", title: "Hồ Chí Minh thắp sáng niềm tin" },
        { id: 7, youtubeId: "01q6P2LfgxE", title: "Hồ Chí Minh giữ trọn một con đường" },
        { id: 8, youtubeId: "H4xEN0wMzEo", title: "Bác Hồ với nhân dân - Những thước phim vô giá" },
        { id: 9, youtubeId: "xjMcJ7yJA8M", title: "Hồ Chí Minh - Bài ca kết đoàn" },
        { id: 10, youtubeId: "34GKvR8nZus", title: "Bác Hồ đọc Tuyên ngôn Độc lập" }
    ];

    const targetVangVongTitles = [
        "Tập 1: TÔI HIẾN CẢ ĐỜI TÔI CHO DÂN TỘC TÔI",
        "Tập 2: DÂN TỘC VIỆT NAM LÀ MỘT, NƯỚC VIỆT NAM LÀ MỘT",
        "Tập 3: ĐẢNG CẦN PHẢI MẠNH HƠN BAO GIỜ HẾT",
        "Tập 4: TRONG BẦU TRỜI KHÔNG GÌ QUÝ BẰNG NHÂN DÂN",
        "Tập 5: PHẢI XỨNG ĐÁNG LÀ NGƯỜI LÃNH ĐẠO, LÀ NGƯỜI ĐẦY TỚ THẬT TRUNG THÀNH CỦA NHÂN DÂN",
        "Tập 6: THANG THUỐC HAY NHẤT LÀ THIẾT THỰC PHÊ BÌNH VÀ TỰ PHÊ BÌNH",
        "Tập 7: CÒN SỐNG THÌ CÒN PHẢI HỌC",
        "Tập 8: VĂN HÓA SOI ĐƯỜNG CHO QUỐC DÂN ĐI",
        "Tập 9: ĐẠI ĐOÀN KẾT LÀ MỘT LỰC LƯỢNG TẤT THẮNG",
        "Tập 10: TRUNG VỚI ĐẢNG, HIẾU VỚI DÂN",
        "Tập 11: NGOẠI GIAO HÒA BÌNH VÀ HỮU NGHỊ GIỮA CÁC DÂN TỘC",
        "Tập 12: TÔI ĐỂ LẠI MUÔN VÀN TÌNH THÂN YÊU"
    ];

    const targetTaiLieuTitles = [
        "70 năm tác phẩm Cần Kiệm Liêm Chính của Chủ tịch Hồ Chí Minh - Giá trị lịch sử",
        "130 câu nói của Chủ tịch Hồ Chí Minh về xây dựng Đảng",
        "Bác Hồ với nông dân",
        "Chuyện kể về Bác Hồ",
        "Chuyện thường ngày của Bác Hồ",
        "Di chúc Bác Hồ mãi là ánh sáng soi đường cho dân tộc Việt Nam",
        "Giá trị của bản Lời kêu gọi toàn quốc kháng chiến năm 1946 của Hồ Chí Minh",
        "Hồ Chí Minh - Biểu tượng của hòa bình và hữu nghị",
        "Hồ Chí Minh - Một cốt cách văn hóa Việt Nam",
        "Hồ Chí Minh về công tác Tư tưởng Văn hóa",
        "Hồ Chí Minh với việc chữa bệnh làm mất dân chủ",
        "Học ở trường - Học ở sách vở - Học lẫn nhau - Học ở Nhân dân",
        "Huyền thoại Hồ Chí Minh",
        "Nâng cao chất lượng dạy học tác phẩm Hồ Chí Minh",
        "Nâng cao đạo đức cách mạng quét sạch chủ nghĩa cá nhân",
        "Phong cách Bác Hồ đến cơ sở",
        "Sổ tay học tập làm theo lời Bác",
        "SUỐT ĐỜI HỌC BÁC",
        "Tài liệu học tập Tư tưởng phong cách Hồ Chí Minh - CT 05",
        "Tài liệu học tập chuyên đề Hồ Chí Minh",
        "Triết lý hành động Hồ Chí Minh",
        "Tư tưởng Hồ Chí Minh về vai trò của Nhân dân trong sự nghiệp gìn giữ TTAN",
        "Tư tưởng Hồ Chí Minh về Văn hóa dân chủ trong hoạt động chính trị"
    ];

    const targetTrongLongTitles = [
        "Bác Hồ trong trái tim những người bạn quốc tế",
        "Bác Hồ với những mùa xuân",
        "Chủ tịch Hồ Chí Minh với Đại tướng Võ Nguyên Giáp",
        "Giữ yên giấc ngủ của Người",
        "Hình ảnh và câu nói hay của Bác Hồ",
        "Hồ Chí Minh - 474 ngày độc lập đầu tiên",
        "Hồ Chí Minh - Vĩ đại một con người",
        "Hồ Chí Minh và những vần thơ",
        "Hồ Chí Minh với nước Nga",
        "Một giờ với đồng chí Hồ Chí Minh",
        "Nửa thế kỷ thơ văn Hồ Chí Minh",
        "Thầy giáo Nguyễn Tất Thành dạy học ở Phan Thiết - Phần 1",
        "Tình cảm của nhân dân thế giới với Chủ tịch Hồ Chí Minh"
    ];

    // Hàm xử lý Data dùng chung cho cả Cache và API
    const processData = (allDocs) => {
        let filteredBooks = [];

        if (isVangVong) {
            filteredBooks = allDocs.filter(doc => {
                const title = (doc.title || "").toUpperCase();
                return targetVangVongTitles.some(target => title.includes(target.toUpperCase()));
            });
            filteredBooks.sort((a, b) => {
                const getNum = (title) => {
                    const match = (title || "").match(/Tập (\d+)/i);
                    return match ? parseInt(match[1], 10) : 0;
                };
                return getNum(a.title) - getNum(b.title);
            });
        } else if (isTaiLieu) {
            filteredBooks = allDocs.filter(doc => {
                const title = (doc.title || "").toUpperCase();
                return targetTaiLieuTitles.some(target => title.includes(target.toUpperCase()));
            });
            filteredBooks.sort((a, b) => {
                const indexA = targetTaiLieuTitles.findIndex(t => (a.title || "").toUpperCase().includes(t.toUpperCase()));
                const indexB = targetTaiLieuTitles.findIndex(t => (b.title || "").toUpperCase().includes(t.toUpperCase()));
                return indexA - indexB;
            });
        } else if (isTrongLong) {
            filteredBooks = allDocs.filter(doc => {
                const title = (doc.title || "").toUpperCase();
                return targetTrongLongTitles.some(target => title.includes(target.toUpperCase()));
            });
            filteredBooks.sort((a, b) => {
                const indexA = targetTrongLongTitles.findIndex(t => (a.title || "").toUpperCase().includes(t.toUpperCase()));
                const indexB = targetTrongLongTitles.findIndex(t => (b.title || "").toUpperCase().includes(t.toUpperCase()));
                return indexA - indexB;
            });
        }

        setContentData(filteredBooks);
        setLoading(false);
    };

    useEffect(() => {
        // Nếu không phải trang PDF Series (Tin tức), gọi API bình thường
        if (!isPdfSeries) {
            setLoading(true);
            api.get('/news', { params: { category: type } })
                .then((res) => {
                    const dataArray = Array.isArray(res.data) ? res.data : (res.data.content || []);
                    setContentData(dataArray);
                    setLoading(false);
                })
                .catch(() => {
                    setContentData([]);
                    setLoading(false);
                });
            return;
        }

        // STALE-WHILE-REVALIDATE CHO TRANG TÀI LIỆU
        const cachedData = sessionStorage.getItem('ideologyDocsCache');

        if (cachedData) {
            // 1. Nếu có Cache -> Render ngay lập tức, không đợi Loading
            processData(JSON.parse(cachedData));
        } else {
            // Nếu chưa có Cache -> Bật Loading chờ API
            setLoading(true);
        }

        // 2. Luôn gọi ngầm API để cập nhật dữ liệu mới nếu có (Revalidate)
        api.get('/documents?page=0&size=150')
            .then(res => {
                let allDocs = [];
                if (Array.isArray(res.data)) allDocs = res.data;
                else if (res.data && Array.isArray(res.data.content)) allDocs = res.data.content;
                else if (res.data && Array.isArray(res.data.data)) allDocs = res.data.data;

                // Nếu dữ liệu mới khác Cache cũ -> Lưu đè Cache và Update màn hình
                if (JSON.stringify(allDocs) !== cachedData) {
                    sessionStorage.setItem('ideologyDocsCache', JSON.stringify(allDocs));
                    processData(allDocs);
                }
            })
            .catch(err => {
                console.error("Lỗi API:", err);
                if (!cachedData) setLoading(false);
            });

    }, [type, isPdfSeries, isVangVong, isTaiLieu, isTrongLong]);

    const renderImage = (item) => {
        const imgSrc = item.coverImageUrl || item.image || item.cover_image_url;

        if (imgSrc && imgSrc.trim() !== '' && !imgSrc.includes('placeholder.com') && !imgSrc.includes('googleusercontent') && !imgSrc.includes('camau.gov')) {
            return (
                <img
                    src={imgSrc}
                    alt={item.title}
                    // Thêm loading="lazy" để tăng tốc render list dài
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://upload.wikimedia.org/wikipedia/commons/e/e0/Ho_Chi_Minh_1946.jpg";
                    }}
                />
            );
        }

        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#fdf5e6] border-2 border-red-800 p-2 text-center group-hover:bg-[#faeed6] transition-colors relative overflow-hidden">
                <div className="absolute top-1 left-1 right-1 bottom-1 border border-red-800/30"></div>
                {/* ĐÃ SỬA: Thêm font Lora */}
                <h4 className="text-red-800 font-bold text-xs uppercase leading-tight line-clamp-4 relative z-10 px-1 font-['Lora',serif]">
                    {item.title}
                </h4>
                <div className="mt-3 bg-red-800 w-8 h-0.5 relative z-10"></div>
            </div>
        );
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = contentData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(contentData.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

    return (
        <div className="min-h-screen bg-[#fcf9f2] py-8 px-4 font-sans selection:bg-red-200">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    <div className="lg:col-span-8">
                        {/* ĐÃ SỬA: Thay đổi sang font Lora cho tiêu đề chuyên mục */}
                        <h2 className="text-xl md:text-2xl font-bold text-red-800 uppercase mb-6 border-b-2 border-red-700 pb-2 font-['Lora',serif]">
                            {pageTitle}
                        </h2>

                        <div className="min-h-[400px]">
                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
                                </div>
                            ) : contentData.length > 0 ? (
                                <div className="flex flex-col gap-6">
                                    {currentItems.map((book) => (
                                        <div
                                            key={book.id}
                                            onClick={() => navigate(isPdfSeries ? `/book/${book.id}` : `/article/${book.id}`)}
                                            className="flex flex-col sm:flex-row gap-6 group cursor-pointer bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-red-200 transition-all duration-300"
                                        >
                                            <div className="w-24 sm:w-32 shrink-0 overflow-hidden rounded shadow-sm aspect-[2/3] border border-gray-200">
                                                {renderImage(book)}
                                            </div>
                                            <div className="flex flex-col flex-1 py-1">
                                                            {/* ĐÃ SỬA: Đổi font Lora cho tiêu đề sách */}
                                                            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-red-700 transition-colors leading-snug font-['Lora',serif]">
                                                    {book.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-3 text-left leading-relaxed font-['Lora',serif]">
                                                    {book.description || 'Tuyển tập đặc sắc về tư tưởng của Bác...'}
                                                </p>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <span className="px-3 py-1 bg-red-50 text-red-700 text-[10px] font-bold uppercase rounded border border-red-100 flex items-center gap-1 font-['Lora',_serif]">
                                                            Đọc {book.readType === 'DOCX' ? 'DOCX' : 'PDF'}
                                                        </span>
                                                        {book.author && (
                                                            <span className="text-[11px] text-gray-500 font-medium italic font-['Lora',serif]">
                                                                Tác giả: {book.author}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] text-gray-400 font-['Lora',serif]">
                                                        {book.viewCount ? `Lượt xem: ${book.viewCount}` : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* THANH PHÂN TRANG */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-gray-200">
                                            <button
                                                onClick={prevPage}
                                                disabled={currentPage === 1}
                                                className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors font-['Lora',serif] ${currentPage === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' : 'border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200'}`}
                                            >
                                                « Trước
                                            </button>

                                            <div className="flex gap-1">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                                    <button
                                                        key={number}
                                                        onClick={() => paginate(number)}
                                                        className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold transition-colors font-['Lora',serif] ${currentPage === number
                                                                ? 'bg-red-700 text-white shadow-sm'
                                                                : 'bg-white text-gray-600 border border-gray-300 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                                                            }`}
                                                    >
                                                        {number}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={nextPage}
                                                disabled={currentPage === totalPages}
                                                className={`px-3 py-1.5 rounded-md text-sm font-medium border transition-colors font-['Lora',serif] ${currentPage === totalPages ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50' : 'border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200'}`}
                                            >
                                                Sau »
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white/50 rounded-2xl border-2 border-dashed border-gray-200">
                                    <p className="text-gray-500 italic font-['Lora',serif]">Danh mục này hiện chưa có tài liệu nào.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CỘT PHẢI: VIDEO */}
                    <div className="lg:col-span-4 lg:sticky lg:top-20 h-fit">
                        {/* ĐÃ SỬA: Đổi sang font Lora */}
                        <h2 className="text-lg font-bold text-red-700 uppercase mb-6 border-b-2 border-red-700 pb-2 font-['Lora',serif]">
                            Tư liệu Video
                        </h2>
                        <div className="space-y-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {videosList.map((v) => (
                                <div
                                    key={v.id}
                                    onClick={() => navigate(`/video/${v.id}`)}
                                    className="flex gap-3 group cursor-pointer items-start border-b border-gray-100 pb-3 hover:bg-red-50 p-1.5 rounded transition-all"
                                >
                                    <div className="relative w-28 shrink-0 aspect-video bg-stone-200 rounded overflow-hidden shadow-sm">
                                        <img
                                            src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            alt="Video thumbnail"
                                        />
                                    </div>
                                    {/* ĐÃ SỬA: Thêm font Lora */}
                                    <h4 className="font-bold text-[13px] text-gray-800 group-hover:text-red-700 line-clamp-2 leading-snug font-['Lora',serif]">
                                        {v.title}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #da251d; border-radius: 4px; }`}</style>
        </div>
    );
}

export default IdeologyPage;