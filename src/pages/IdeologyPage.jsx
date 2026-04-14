import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function IdeologyPage() {
    const navigate = useNavigate();
    const { type } = useParams();

    const [activeTab, setActiveTab] = useState('nguon-goc');
    const [contentData, setContentData] = useState([]);
    const [loading, setLoading] = useState(true);

    const isPdfSeries = type && (type.includes('vang-vong') || type.includes('non-nuoc'));

    let pageTitle = "Sáng mãi niềm tin theo Bác";
    if (isPdfSeries) {
        pageTitle = "Hồ Chí Minh – Vang vọng lời non nước";
    } else if (type === 've-ho-chi-minh') {
        pageTitle = "Những tác phẩm viết về Hồ Chí Minh";
    } else if (type === 'tai-lieu-hoc-tap') {
        pageTitle = "Tài liệu học tập làm theo Bác";
    }

    const videosList = [
        { id: 1, youtubeId: "58HGVK6j-80", title: "Hành trình tìm đường cứu nước của Chủ tịch Hồ Chí Minh" },
        { id: 2, youtubeId: "RR0p5Aqrhto", title: "TOÀN CẢNH HÀNH TRÌM TÌM ĐƯỜNG CỨU NƯỚC" },
        { id: 3, youtubeId: "d5MYTDacTZ4", title: "Hồ Chí Minh - Chân dung một con người" },
        { id: 4, youtubeId: "H5_Hu1ju1QM", title: "Hồ Chí Minh - Một hành trình" },
        { id: 5, youtubeId: "e0CEWmWG79U", title: "Hồ Chí Minh – Dấu chân đầu tiên" },
        { id: 6, youtubeId: "VzpimJtKfnE", title: "Hồ Chí Minh thắp sáng niềm tin" },
        { id: 7, youtubeId: "01q6P2LfgxE", title: "Hồ Chí Minh giữ trọn một con đường" },
        { id: 8, youtubeId: "H4xEN0wMzEo", title: "Bác Hồ với nhân dân - Những thước phim vô giá" },
        { id: 9, youtubeId: "xjMcJ7yJA8M", title: "Hồ Chí Minh - Bài ca kết đoàn" },
        { id: 10, youtubeId: "34GKvR8nZus", title: "Bác Hồ đọc Tuyên ngôn Độc lập" }
    ];

    const targetTitles = [
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

    useEffect(() => {
        setLoading(true);
        setContentData([]);

        if (isPdfSeries) {
            api.get('/documents?page=0&size=150')
                .then(res => {
                    let allDocs = [];
                    if (Array.isArray(res.data)) allDocs = res.data;
                    else if (res.data && Array.isArray(res.data.content)) allDocs = res.data.content;
                    else if (res.data && Array.isArray(res.data.data)) allDocs = res.data.data;

                    const vvBooks = allDocs.filter(doc => {
                        const title = (doc.title || "").toUpperCase();
                        // Kiểm tra xem tiêu đề của API trả về có khớp với 1 trong 12 tiêu đề mục tiêu không
                        return targetTitles.some(target => title.includes(target.toUpperCase()));
                    });

                    // 🏆 SẮP XẾP CHUẨN
                    const sortedBooks = vvBooks.sort((a, b) => {
                        const getNum = (title) => {
                            const match = (title || "").match(/Tập (\d+)/i);
                            return match ? parseInt(match[1], 10) : 0;
                        };
                        return getNum(a.title) - getNum(b.title);
                    });

                    setContentData(sortedBooks);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Lỗi API:", err);
                    setLoading(false);
                });
        } else {
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
        }
    }, [type, isPdfSeries]);

    return (
        <div className="min-h-screen bg-[#fcf9f2] py-8 px-4 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* CỘT TRÁI */}
                    <div className="lg:col-span-8">
                        <h2 className="text-xl md:text-2xl font-bold text-red-800 uppercase mb-6 border-b-2 border-red-700 pb-2 font-serif">
                            {pageTitle}
                        </h2>

                        <div className="min-h-[400px]">
                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
                                </div>
                            ) : contentData.length > 0 ? (
                                <div className="flex flex-col gap-6">
                                    {contentData.map((book) => (
                                        <div
                                            key={book.id}
                                            onClick={() => navigate(`/book/${book.id}`)}
                                            className="flex flex-col sm:flex-row gap-6 group cursor-pointer bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-red-200 transition-all duration-300"
                                        >
                                            <div className="w-24 sm:w-32 shrink-0 overflow-hidden rounded shadow-md aspect-[2/3] bg-stone-100">
                                                <img
                                                    src={book.coverImageUrl || book.image || "https://via.placeholder.com/300x450?text=No+Cover"}
                                                    alt="Cover"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex flex-col flex-1 py-1">
                                                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-red-700 leading-snug">
                                                    {book.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                                    {book.description || 'Tuyển tập đặc sắc về tư tưởng của Bác...'}
                                                </p>
                                                <div className="mt-auto flex items-center gap-4">
                                                    <span className="px-3 py-1 bg-red-50 text-red-700 text-[10px] font-bold uppercase rounded border border-red-100 flex items-center gap-1">
                                                        Đọc PDF
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white border-2 border-dashed border-red-200 rounded-2xl">
                                    <p className="text-gray-500 italic">Chưa tìm thấy dữ liệu.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CỘT PHẢI: VIDEO */}
                    <div className="lg:col-span-4 lg:sticky lg:top-20 h-fit">
                        <h2 className="text-lg font-bold text-red-700 uppercase mb-6 border-b-2 border-red-700 pb-2 font-serif">
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
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                                            alt="Video thumbnail" 
                                        />
                                    </div>
                                    <h4 className="font-bold text-[13px] text-gray-800 group-hover:text-red-700 line-clamp-2 leading-snug">
                                        {v.title}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #da251d; border-radius: 4px; }`}</style>
        </div>
    );
}

export default IdeologyPage;