import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { videosList } from '../data/videos';

function IdeologyPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('nguon-goc');
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Danh sách các Tab
    const tabs = [
        { id: 'nguon-goc', label: 'Nguồn gốc hình thành' },
        { id: 'noi-dung', label: 'Nội dung tư tưởng, đạo đức' },
        { id: 'nghien-cuu', label: 'Nghiên cứu tư tưởng, đạo đức Hồ Chí Minh' }
    ];

    // 🌟 DANH SÁCH 10 VIDEO TƯ LIỆU VỀ HỒ CHÍ MINH
    const videosList = [
        { id: 1, youtubeId: "58HGVK6j-80", title: "Hành trình tìm đường cứu nước của Chủ tịch Hồ Chí Minh | Phim tài liệu lịch sử" },
    { id: 2, youtubeId: "RR0p5Aqrhto", title: "TOÀN CẢNH HÀNH TRÌM TÌM ĐƯỜNG CỨU NƯỚC CỦA NGUYỄN ÁI QUỐC" },
    { id: 3, youtubeId: "d5MYTDacTZ4", title: "[Phim tài liệu] Hồ Chí Minh - Chân dung một con người" },
    { id: 4, youtubeId: "H5_Hu1ju1QM", title: "Hồ Chí Minh - Một hành trình (Bản chuẩn Full)" },
    { id: 5, youtubeId: "e0CEWmWG79U", title: "Phim tài liệu: Hồ Chí Minh – Dấu chân đầu tiên (Tập 1)" },
    { id: 6, youtubeId: "VzpimJtKfnE", title: "Hồ Chí Minh thắp sáng niềm tin" },
    { id: 7, youtubeId: "01q6P2LfgxE", title: "Việt Nam - Hồ Chí Minh giữ trọn một con đường" },
    { id: 8, youtubeId: "H4xEN0wMzEo", title: "Bác Hồ với nhân dân - Những thước phim vô giá" },
    { id: 9, youtubeId: "xjMcJ7yJA8M", title: "Hồ Chí Minh - Bài ca kết đoàn (Phim Tài Liệu)" },
    { id: 10, youtubeId: "34GKvR8nZus", title: "Bác Hồ đọc Tuyên ngôn Độc lập ngày 2/9/1945" }
    ];

    // State để lưu xem video nào đang được chọn phát
    const [activeVideo, setActiveVideo] = useState(videosList[0]);

    // 🌟 GỌI API LẤY DANH SÁCH BÀI VIẾT TỪ SPRING BOOT
    useEffect(() => {
        setLoading(true);
        setArticles([]);

        api.get('/news', { params: { category: activeTab } })
            .then((res) => {
                const dataArray = Array.isArray(res.data) ? res.data : [];
                const formattedArticles = dataArray.map((item, index) => ({
                    id: index,
                    title: item.title,
                    excerpt: item.description,
                    imageUrl: item.image,
                    url: item.url,
                    publishDate: item.publishedAt
                }));
                setArticles(formattedArticles);
            })
            .catch((err) => {
                console.warn("Chưa kết nối được Backend, dùng dữ liệu giả để test UI:", err);
                setTimeout(() => {
                    setArticles(getFakeData(activeTab));
                    setLoading(false);
                }, 600);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-[#fcf9f2] py-8 px-4 font-sans selection:bg-red-200">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* CỘT TRÁI: DANH SÁCH BÀI VIẾT */}
                    <div className="lg:col-span-8">
                        <h2 className="text-xl md:text-2xl font-bold text-red-700 uppercase mb-4 border-b-2 border-red-700 pb-2">
                            Tư tưởng, đạo đức, phong cách Hồ Chí Minh
                        </h2>

                        {/* HỆ THỐNG TAB */}
                        <div className="flex flex-wrap items-center text-sm md:text-base font-bold mb-8 border-b border-gray-200">
                            {tabs.map((tab, index) => (
                                <div key={tab.id} className="flex items-center">
                                    <button
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-3 px-1 relative transition-colors ${activeTab === tab.id ? 'text-red-700' : 'text-gray-600 hover:text-red-700'}`}
                                    >
                                        {tab.label}
                                        {activeTab === tab.id && <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-red-700"></span>}
                                    </button>
                                    {index < tabs.length - 1 && <span className="mx-3 text-gray-300 font-normal">|</span>}
                                </div>
                            ))}
                        </div>

                        {/* LIST BÀI VIẾT */}
                        <div className="space-y-8 min-h-[400px]">
                            {loading ? (
                                <div className="flex justify-center items-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
                                </div>
                            ) : articles.length > 0 ? (
                                articles.map((article) => (
                                    <div
                                        key={article.id}
                                        onClick={() => navigate(`/article/${article.id}`)}
                                        className="flex flex-col md:flex-row gap-6 group cursor-pointer border-b border-gray-200 pb-8 last:border-0 hover:bg-white transition-colors p-2 -mx-2 rounded-lg"
                                    >
                                        <div className="w-full md:w-1/3 shrink-0 overflow-hidden rounded shadow-sm relative">
                                            <img
                                                src={article.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
                                                alt={article.title}
                                                className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="w-full md:w-2/3 flex flex-col">
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-red-700 transition-colors leading-snug">
                                                {article.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 line-clamp-3 text-justify">
                                                {article.excerpt}
                                            </p>
                                            <div className="mt-auto text-right flex justify-between items-center text-sm">
                                                <span className="text-gray-400 font-medium">{article.publishDate ? new Date(article.publishDate).toLocaleDateString('vi-VN') : ''}</span>
                                                <span className="text-red-600 font-bold group-hover:text-red-800 transition-colors">Xem chi tiết »</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-500 italic">Chưa có bài viết nào cho chuyên mục này.</div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-4">
                        <h2 className="text-lg font-bold text-red-700 uppercase mb-6 border-b-2 border-red-700 pb-2">
                            Tư liệu Video
                        </h2>

                        {/* TRÌNH PHÁT VIDEO CHÍNH (Lấy video số 1) */}
                        <div className="mb-6 cursor-pointer group" onClick={() => navigate(`/video/${videosList[0].id}`)}>
                            <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-md mb-3">
                                <img
                                    src={`https://img.youtube.com/vi/${videosList[0].youtubeId}/maxresdefault.jpg`}
                                    alt="Video"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-xl group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-700 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                </div>
                            </div>
                            {/* Title chuyển đỏ khi hover vào khối */}
                            <h3 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-red-700 transition-colors">
                                {videosList[0].title}
                            </h3>
                        </div>

                        {/* DANH SÁCH 24 VIDEO CÒN LẠI CÓ THANH CUỘN */}
                        <div className="space-y-4 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {/* Bỏ qua video đầu tiên vì đã nằm ở cái khung bự ở trên */}
                            {videosList.slice(1).map((video) => (
                                <div
                                    key={video.id}
                                    onClick={() => navigate(`/video/${video.id}`)} // 🌟 CHUYỂN SANG TRANG DETAIL
                                    className="flex gap-3 group cursor-pointer items-start border-b border-gray-100 pb-4 last:border-0 p-2 rounded hover:bg-red-50 transition-colors"
                                >
                                    <div className="relative w-32 shrink-0 aspect-video bg-gray-200 rounded overflow-hidden shadow-sm">
                                        <img
                                            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                                            alt={video.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                        </div>
                                    </div>
                                    {/* 🌟 Title chuyển đỏ mượt mà khi hover */}
                                    <h4 className="font-bold text-sm text-gray-800 group-hover:text-red-700 transition-colors leading-tight line-clamp-3">
                                        {video.title}
                                    </h4>
                                </div>
                            ))}
                        </div>


                </div>
            </div>
        </div>

            {/* Thêm chút CSS cho thanh cuộn đẹp hơn */ }
    <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #da251d; 
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #b71a14; 
                }
            `}</style>
        </div >
    );
}

// HÀM TẠO DỮ LIỆU FAKE
function getFakeData(tabId) {
    if (tabId === 'nguon-goc') {
        return [
            {
                id: 101, title: "Quê hương và gia đình - Cội nguồn hình thành nhân cách",
                excerpt: "Truyền thống yêu nước của quê hương Nghệ An và nền tảng giáo dục Nho học từ gia đình...",
                imageUrl: "https://file3.qdnd.vn/data/images/0/2023/05/18/vuhuyen/bac%20ho.jpg"
            },
            {
                id: 102, title: "Hành trình ra đi tìm đường cứu nước",
                excerpt: "Năm 1911, người thanh niên yêu nước Nguyễn Tất Thành lên tàu Amiral Latouche-Tréville...",
                imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Ho_Chi_Minh_1946.jpg"
            }
        ];
    } else if (tabId === 'noi-dung') {
        return [
            {
                id: 201, title: "Bác Hồ với dân chủ và bài học về đạo đức cách mạng",
                excerpt: "Mùa xuân năm 1946 là một mùa xuân đặc biệt, gắn với sự kiện Quốc hội đầu tiên của nước Việt Nam mới...",
                imageUrl: "https://tulieuvankien.dangcongsan.vn/Uploads/2018/1/31/ho-chi-minh-1-31.jpg"
            }
        ];
    } else {
        return [
            {
                id: 301, title: "Lan tỏa những cách làm hay trong học tập và làm theo Bác",
                excerpt: "Bộ đội Biên phòng đưa việc học tập và làm theo Bác trở thành việc làm thường xuyên...",
                imageUrl: "https://cdn.tuoitre.vn/47158475281733632/2023/5/19/bac-ho-bo-doi-16844627448201211754026.jpg"
            }
        ];
    }
}

export default IdeologyPage;