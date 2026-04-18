import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { videosList } from '../data/videos'; 

function VideoDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    // Lấy video hiện tại (nếu ai đó gõ sai ID thì lấy video 1)
    const currentVideo = videosList.find(v => v.id === parseInt(id)) || videosList[0];
    
    // Lấy TẤT CẢ các video khác (Lọc bỏ cái đang phát)
    const relatedVideos = videosList.filter(v => v.id !== currentVideo.id);

    return (
        <div className="min-h-screen bg-[#fcf9f2] py-8 px-4 font-sans selection:bg-red-200">
            <div className="max-w-7xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">

                {/* Tiêu đề mục */}
                <div className="border-b-[3px] border-red-700 pb-2 mb-6 inline-block">
                    <h2 className="text-xl md:text-2xl font-['Lora',serif] font-bold text-red-700 uppercase">Tư liệu Video</h2>
                </div>

                {/* Khu vực phát Video chính (Chia cột 8 - 4) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                    <div className="lg:col-span-8">
                        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-md border border-gray-200">
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

                    <div className="lg:col-span-4 flex flex-col justify-start">
                        <h1 className="text-xl md:text-2xl font-['Lora',serif] font-bold text-gray-900 mb-4 leading-snug">
                            {currentVideo.title}
                        </h1>
                        <div className="text-gray-600 text-[15px] space-y-3 pb-6 border-b border-gray-100">
                            <p><span className="font-semibold text-gray-800">Nguồn:</span> hochiminh.vn</p>
                            <p><span className="font-semibold text-gray-800">Đã xem:</span> {Math.floor(Math.random() * 50000) + 10000} lượt</p>
                        </div>
                        <button onClick={() => navigate(-1)} className="mt-6 text-red-600 hover:text-red-800 text-[15px] font-semibold flex items-center transition-colors w-fit bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-lg">
                            ← Quay lại trang trước
                        </button>
                    </div>
                </div>

                <div className="border-b-[3px] border-red-700 pb-2 mb-8 inline-block w-full">
                    <h2 className="text-lg md:text-xl font-['Lora',serif] font-bold text-red-700 uppercase">Tư liệu Video Khác</h2>
                </div>

                {/* Lưới 4 cột (Trên máy tính) và 2 cột (Trên điện thoại/Tablet) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {relatedVideos.map(video => (
                        <Link to={`/video/${video.id}`} key={video.id} className="group cursor-pointer flex flex-col bg-white rounded-lg hover:shadow-lg transition-shadow border border-gray-50 overflow-hidden">
                            <div className="relative w-full aspect-video bg-gray-200 overflow-hidden border-b border-gray-100">
                                <img
                                    src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                                    <div className="bg-red-700/90 text-white rounded-full p-2.5 shadow-lg transform group-hover:scale-110 transition-transform">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-['Lora',serif] font-bold text-[14px] text-gray-800 group-hover:text-red-700 transition-colors leading-snug line-clamp-2">
                                    {video.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default VideoDetailPage;