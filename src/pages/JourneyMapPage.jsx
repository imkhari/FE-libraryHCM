import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import WorldMap from '../assets/world-map.png';

const journeyPoints = [
    {
        id: 1, year: "1911", location: "Bến Nhà Rồng, Sài Gòn", country: "Việt Nam", coords: { x: 76.6, y: 32.5 },
        image: "https://data.ihoc.vn/ihoc-bucket/2023/07/cang-nha-rong.jpg",
        title: "Khởi đầu vĩ đại",
        desc: "Ngày 5/6/1911, người thanh niên Nguyễn Tất Thành với tên gọi Văn Ba đã xin làm phụ bếp trên tàu Amiral Latouche-Tréville, rời bến cảng Sài Gòn bắt đầu hành trình tìm đường cứu nước.",
        significance: "Sự kiện đánh dấu bước ngoặt đầu tiên, thể hiện tư duy độc lập: không đi theo con đường Đông du của các bậc tiền bối mà quyết tâm sang phương Tây."
    },
    {
        id: 2, year: "1911", location: "Colombo", country: "Sri Lanka", coords: { x: 59.1, y: 47.1 },
        image: "https://bcp.cdnchinhphu.vn/zoom/600_315/Uploaded/tranthitiep/2021_06_01/tau2.jpg",
        title: "Chứng kiến nỗi đau chung",
        desc: "Trên hành trình sang Pháp, tàu dừng chân tại cảng Colombo, Port Said, Singapore... Người đã dành thời gian lên bờ quan sát đời sống của người dân bản địa.",
        significance: "Người nhận ra một chân lý đầu tiên: Ở đâu bọn đế quốc, thực dân cũng tàn bạo, độc ác; ở đâu những người lao động cũng bị bóc lột, áp bức."
    },
    {
        id: 3, year: "1911", location: "Marseille", country: "Pháp", coords: { x: 49.4, y: 17.0 },
        image: "https://truyenhinhnghean.vn/file/4028eaa46735a26101673a4df345003c/4028eaa467f477c80167f48e23810ac6/112019/macxay2_201911111721.jpg",
        title: "Vỡ mộng về 'Mẫu quốc'",
        desc: "Tháng 7/1911, Nguyễn Tất Thành đặt chân đến cảng Marseille. Trái với những từ ngữ hào nhoáng 'Tự do - Bình đẳng - Bác ái' mà thực dân rao giảng, Người thấy ở Pháp cũng có rất nhiều người nghèo khổ.",
        significance: "Bước đầu định hình tư tưởng: Nhân dân lao động ở các nước đế quốc cũng là nạn nhân của sự bóc lột."
    },
    {
        id: 4, year: "1912", location: "New York & Boston", country: "Mỹ", coords: { x: 26.4, y: 18.4 },
        image: "https://image.vietmy.net.vn/public/data/images/0/2025/08/18/upload_2144/image-20240605071802-2.jpeg",
        title: "Khảo sát 'Tân thế giới'",
        desc: "Người đến Mỹ, làm thuê tại khu Brooklyn (New York) và Boston. Tại đây, Người tham dự các buổi sinh hoạt chính trị, tìm hiểu cuộc đấu tranh của người da đen và tìm đọc Bản Tuyên ngôn Độc lập (1776).",
        significance: "Người nhận thấy nước Mỹ tuy nói là cộng hòa và dân chủ, nhưng thực chất vẫn là nền độc tài của tư bản, người da màu vẫn bị đè nén."
    },
    {
        id: 5, year: "1913", location: "London", country: "Anh", coords: { x: 47.0, y: 9.0 },
        image: "https://bna.1cdn.vn/2025/05/14/khach-san-carlton-o-london-anh-noi-nguoi-thanh-nien-yeu-nuoc-nguyen-tat-thanh-lam-viec-trong-thoi-gian-song-o-nuoc-anh-nam-1914..jpg",
        title: "Rèn luyện trong phong trào công nhân",
        desc: "Người làm đủ mọi nghề: quét tuyết, đốt lò, rửa bát, rồi phụ bếp tại khách sạn Carlton. Người bắt đầu tham gia 'Hội những người lao động hải ngoại'.",
        significance: "Quá trình lao động cực nhọc giúp Người hòa mình trọn vẹn vào giai cấp công nhân quốc tế, rèn luyện bản lĩnh chính trị."
    },
    {
        id: 6, year: "1917", location: "Paris", country: "Pháp", coords: { x: 49.5, y: 11.0 },
        image: "https://images.spiderum.com/sp-images/55d8f4504a9c11ef8293019fc975e0f6.png",
        title: "Trở lại trung tâm chính trị",
        desc: "Nguyễn Tất Thành đổi tên thành Nguyễn Ái Quốc, kết thân với nhiều nhà tư tưởng tiến bộ và tích cực viết báo vạch trần tội ác thực dân.",
        significance: "Bắt đầu sử dụng báo chí làm vũ khí đấu tranh. Người chính thức trở thành một trí thức cách mạng có tầm ảnh hưởng tại Paris."
    },
    {
        id: 7, year: "1919", location: "Hội nghị Versailles", country: "Pháp", coords: { x: 47.5, y: 14.5 },
        image: "https://media.vov.vn/sites/default/files/styles/large/public/2021-06/nguyen_ai_quoc_tai_dai_hoi_dcs_phap_o_tours_2.jpg",
        title: "Tiếng sấm tại Versailles",
        desc: "Ngày 18/6/1919, thay mặt những người yêu nước Việt Nam, Nguyễn Ái Quốc gửi 'Bản yêu sách của nhân dân An Nam' gồm 8 điểm tới Hội nghị Versailles.",
        significance: "Đòn tấn công chính trị trực diện đầu tiên trên trường quốc tế. Yêu sách đã gây tiếng vang lớn, làm bừng tỉnh tinh thần yêu nước."
    },
    {
        id: 8, year: "1923", location: "Moscow", country: "Liên Xô", coords: { x: 57.4, y: 10.0 },
        image: "https://scontent.fdad3-1.fna.fbcdn.net/v/t1.6435-9/101674977_590115574954105_1072893663038601311_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=7b2446&_nc_eui2=AeHE1JkooUXIonkyOvtqlMU58IgidPbyjHLwiCJ09vKMck-vmSrhWCUk8iQGlbeJTtCNSs4SVvegWH0qOGAmB8kJ&_nc_ohc=_FpMqGxfMAQQ7kNvwEM_WV0&_nc_oc=Ado2TTCHWxvTQlQUKJZY2r52ngzlJYxIcAeCOT5MCJ7SltaqTnSzdCjQLKuMdrlHeGWoxS_LRXz8Z9aO85Lb6w1P&_nc_zt=23&_nc_ht=scontent.fdad3-1.fna&_nc_gid=NVDv-vDqEyizgQsxefjBuw&_nc_ss=7a3a8&oh=00_Af2n19m2zc0SuCPoYQV5wTLij8s_tzJn4IFkccy0aCcZeQ&oe=6A09445E",
        title: "Quê hương của Cách mạng Tháng Mười",
        desc: "Người bí mật rời Pháp sang Liên Xô, tham dự Hội nghị Quốc tế Nông dân và Đại hội lần thứ V của Quốc tế Cộng sản. Học tập tại Đại học Phương Đông.",
        significance: "Được trang bị hệ thống lý luận Mác - Lênin bài bản, Người khẳng định: 'Chỉ có chủ nghĩa xã hội mới giải phóng được các dân tộc'."
    },
    {
        id: 9, year: "1924", location: "Quảng Châu", country: "Trung Quốc", coords: { x: 75.4, y: 22.5 },
        image: "https://bqn.1cdn.vn/2020/08/26/baodanang.vn-dataimages-202008-original-_images1577633_11.jpg",
        title: "Chuẩn bị hạt giống đỏ",
        desc: "Được Quốc tế Cộng sản cử về Quảng Châu. Tháng 6/1925, Người thành lập Hội Việt Nam Cách mạng Thanh niên, trực tiếp mở các lớp huấn luyện cán bộ.",
        significance: "Bước chuẩn bị then chốt về chính trị, tư tưởng và tổ chức, tạo ra thế hệ cán bộ nòng cốt đầu tiên tiến tới thành lập Đảng Cộng sản."
    },
    {
        id: 10, year: "1928", location: "Udon Thani", country: "Thái Lan", coords: { x: 73.0, y: 31.3 },
        image: "https://bidv.com.vn/wps/wcm/connect/17bcc7b5-4932-4023-a73d-ca247aaacd41/3/Nh%C3%A0+l%E1%BB%A3p+m%C3%A1i+l%C3%A1+t%C3%A1i+hi%E1%BB%87n+g%E1%BA%A7n+gi%E1%BB%91ng+n%C6%A1i+B%C3%A1c+H%E1%BB%93+sinh+s%E1%BB%91ng+%E1%BB%9F+t%E1%BB%89nh+Udon+Thani%2C+giai+%C4%91o%E1%BA%A1n+1928-1929..jpg?MOD=AJPERES&CVID=",
        title: "Bám rễ trong quần chúng",
        desc: "Hoạt động bí mật với bí danh 'Thầu Chín', Người cùng bà con Việt kiều mở rộng đường giao thông, dựng trường học, xây dựng cơ sở cách mạng.",
        significance: "Thể hiện phong cách 'Quần chúng hóa' của Người: sống cùng dân, lao động cùng dân để tuyên truyền và giác ngộ cách mạng."
    },
    {
        id: 11, year: "1930", location: "Hương Cảng", country: "Hồng Kông", coords: { x: 80.6, y: 25.0 },
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHT7ypzHXLhzxtClnnpW0M32mHDYvEqXskJA&s",
        title: "Mùa xuân thành lập Đảng",
        desc: "Từ ngày 6/1 đến 7/2/1930, tại Cửu Long (Hồng Kông), Người chủ trì Hội nghị hợp nhất ba tổ chức cộng sản, chính thức thành lập Đảng Cộng sản Việt Nam.",
        significance: "Chấm dứt sự khủng hoảng về đường lối cứu nước. Từ đây, cách mạng Việt Nam đã có một đội tiên phong lãnh đạo với đường lối đúng đắn."
    },
    {
        id: 12, year: "1938", location: "Diên An", country: "Trung Quốc", coords: { x: 76.0, y: 18.5 },
        image: "https://images2.thanhnien.vn/528068263637045248/2025/11/4/z718982078595315e032d55228d6e42e9648e8b2e5399b-1762275539365722570597.jpg",
        title: "Nắm bắt thời cơ lịch sử",
        desc: "Người mang cấp bậc Thiếu tá Bát Lộ Quân, hoạt động cùng các lãnh đạo Đảng Cộng sản Trung Quốc, chờ thời cơ.",
        significance: "Người bám sát tình hình chiến tranh thế giới thứ hai, phân tích cục diện để chuẩn bị chớp thời cơ khi phát xít Nhật tiến vào Đông Dương."
    },
    {
        id: 13, year: "1941", location: "Pác Bó, Cao Bằng", country: "Việt Nam", coords: { x: 75.4, y: 27.2 },
        image: "https://media.baocaobang.vn/upload/image/202301/medium/100703_11.jpg",
        title: "Mùa xuân Tổ quốc",
        desc: "Ngày 28/1/1941, sau đúng 30 năm xa cách, Người vượt cột mốc biên giới 108 trở về Tổ quốc. Người lập căn cứ tại hang Pác Bó.",
        significance: "Mở ra trang sử vĩ đại nhất: Thành lập Mặt trận Việt Minh, tiến tới Tổng khởi nghĩa Cách mạng Tháng Tám (1945)."
    }
];

const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};
const fadeUpItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function JourneyMapPage() {
    const [activePoint, setActivePoint] = useState(null);
    const [animationKey, setAnimationKey] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [revealedIndex, setRevealedIndex] = useState(-1);
    const [controls, setControls] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (!isPlaying || !controls) return;

        const interval = setInterval(() => {
            setRevealedIndex((prev) => {
                const nextIndex = prev + 1;

                if (nextIndex < journeyPoints.length) {
                    controls.zoomToElement(`marker-${journeyPoints[nextIndex].id}`, 2.5, 1000, "easeInOutQuad");
                    return nextIndex;
                } else {
                    clearInterval(interval);
                    setIsPlaying(false);
                    setTimeout(() => {
                        controls.resetTransform(1200);
                    }, 2000);
                    return prev;
                }
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [isPlaying, animationKey, controls]);

    const handleStartOrReplay = () => {
        setActivePoint(null);
        setRevealedIndex(-1);
        setAnimationKey(prev => prev + 1);
        setHasStarted(true);
        setIsPlaying(true);
        if (controls) controls.resetTransform(600);
    };

    const handleManualClick = (point) => {
        setActivePoint(point);
        setIsPlaying(false);
        setHasStarted(true);
        setRevealedIndex(journeyPoints.length - 1);

        // Tối ưu Zoom trên Mobile: Điện thoại không zoom quá to để tránh che khuất thẻ Info Card
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        if (controls) controls.zoomToElement(`marker-${point.id}`, isMobile ? 1.8 : 2.5, 800, "easeInOutQuad");
    };

    const handleCloseCard = () => {
        setActivePoint(null);
        if (controls) controls.resetTransform(1000);
    };

    // Xác định xem có phải điện thoại không để set initial scale
    const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;

    return (
        <div className="bg-[#fcf9f2] min-h-screen py-4 md:py-10 font-sans text-gray-900 relative z-10 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none"></div>

            {/* Container responsived */}
            <div className="w-[98%] lg:w-[85%] max-w-[1920px] mx-auto relative flex flex-col items-center h-[calc(100vh-40px)] md:h-[calc(100vh-60px)] min-h-[600px] md:min-h-[750px]">

                {/* 1. HEADER KHU VỰC CHỨA TIÊU ĐỀ */}
                <motion.div variants={staggerContainer} initial="hidden" animate="show" className="text-center mb-2 md:mb-3 w-full">
                    <motion.h1 variants={fadeUpItem} className="text-2xl md:text-5xl font-black uppercase text-red-800 mb-1 md:mb-2 drop-shadow-sm">Theo dấu chân Người</motion.h1>
                    <motion.div variants={fadeUpItem} className="h-1.5 w-16 md:w-24 bg-yellow-500 mx-auto rounded-full mb-2"></motion.div>
                    <motion.p variants={fadeUpItem} className="text-gray-600 font-medium italic text-xs md:text-sm px-2">Hành trình 30 năm bôn ba tìm đường cứu nước của Chủ tịch Hồ Chí Minh (1911 - 1941).</motion.p>
                </motion.div>

                {/* 2. NÚT BẮT ĐẦU ĐƯỢC ĐƯA RA NGOÀI BẢN ĐỒ */}
                <div className="flex justify-center w-full mb-3 md:mb-4 z-20">
                    <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => handleStartOrReplay()}
                        className={`flex items-center gap-2 font-bold px-5 py-2 md:px-6 md:py-2.5 text-sm md:text-base rounded-full shadow-lg border transition-all duration-300 ${isPlaying ? 'bg-gray-800 text-gray-200 border-gray-600' : 'bg-red-700 text-white border-red-800 hover:bg-red-800'}`}
                    >
                        {!hasStarted ? "▶ Bắt đầu hành trình" : isPlaying ? "Đang mô phỏng..." : "↺ Mô phỏng lại"}
                    </motion.button>
                </div>

                {/* 3. KHUNG BẢN ĐỒ CHÍNH */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                    className="w-full flex-1 relative bg-[#eef5f9] border-[4px] md:border-[10px] border-red-800 ring-2 md:ring-4 ring-yellow-500/40 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden flex"
                >
                    <TransformWrapper
                        initialScale={isMobileView ? 0.35 : 0.7} // Cực quan trọng cho mobile
                        minScale={0.2}
                        maxScale={5}
                        centerOnInit={true}
                        centerZoomedOut={true}
                        wheel={{ step: 0.1 }}
                        onInit={(ref) => setControls(ref)}
                    >
                        {({ zoomIn, zoomOut, resetTransform, zoomToElement }) => (
                            <React.Fragment>
                                {/* TOOLBAR ZOOM GÓC PHẢI */}
                                <div className="absolute top-3 right-3 md:top-6 md:right-6 z-[100] flex flex-col gap-1.5 md:gap-2 bg-white/90 p-1 md:p-1.5 rounded-lg md:rounded-xl shadow-xl backdrop-blur-sm border border-gray-200">
                                    <button onClick={() => zoomIn()} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-100 hover:bg-red-100 hover:text-red-700 rounded md:rounded-lg font-black transition-colors">+</button>
                                    <button onClick={() => zoomOut()} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-100 hover:bg-red-100 hover:text-red-700 rounded md:rounded-lg font-black transition-colors">-</button>
                                    <button onClick={() => resetTransform()} className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-gray-100 hover:bg-red-100 hover:text-red-700 rounded md:rounded-lg transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                    </button>
                                </div>

                                {/* TIMELINE BÊN DƯỚI ĐÁY BẢN ĐỒ - Mobile vuốt ngang */}
                                <motion.div className="flex absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] md:w-max max-w-full bg-white/95 backdrop-blur-md px-3 py-2 md:px-6 md:py-4 rounded-xl md:rounded-2xl shadow-2xl border border-red-100 items-center justify-start md:justify-between overflow-x-auto custom-scrollbar snap-x">
                                    {journeyPoints.map((point, index) => {
                                        const isActive = activePoint?.id === point.id;
                                        const isPassed = index <= revealedIndex;
                                        return (
                                            <React.Fragment key={`tl-${point.id}`}>
                                                <div onClick={() => handleManualClick(point)} className="flex flex-col items-center cursor-pointer group px-2 md:px-2 relative shrink-0 snap-center">
                                                    <span className={`absolute -top-5 md:-top-6 text-[10px] md:text-[11px] font-black whitespace-nowrap transition-all duration-300 ${isActive ? 'text-red-700 opacity-100 scale-110' : 'text-gray-400 opacity-0 md:group-hover:opacity-100 group-hover:text-red-500 group-hover:-translate-y-1'}`}>{point.location.split(',')[0]}</span>
                                                    <span className={`text-[10px] md:text-[12px] font-black transition-colors ${isActive ? 'text-red-700' : 'text-gray-500'}`}>{point.year}</span>
                                                    <div className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 mt-0.5 md:mt-0 rounded-full transition-all ${isActive ? 'bg-red-600 ring-2 md:ring-4 ring-red-200 scale-125' : isPassed ? 'bg-red-400' : 'bg-gray-200'}`} />
                                                </div>
                                                {index < journeyPoints.length - 1 && <div className={`h-[2px] md:h-[3px] w-4 md:w-6 lg:w-10 shrink-0 rounded-full ${index < revealedIndex ? 'bg-red-400' : 'bg-gray-100'}`} />}
                                            </React.Fragment>
                                        );
                                    })}
                                </motion.div>

                                <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                                    <div className="relative" style={{
                                        width: isMobileView ? '1600px' : '2400px',
                                        height: isMobileView ? '700px' : '1100px'
                                    }}>
                                        <img src={WorldMap} alt="Map" className="absolute mt-[-110px] inset-0 w-full h-full object-fill opacity-50 mix-blend-multiply" />
                                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

                                        <svg width="0" height="0"><defs><filter id="laser"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs></svg>

                                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
                                            <motion.polyline
                                                key={`line-${animationKey}`}
                                                points={journeyPoints.map(p => `${p.coords.x},${p.coords.y}`).join(' ')}
                                                fill="none" stroke="#dc2626" strokeWidth="0.25" strokeDasharray="0.6, 1.2" strokeLinecap="round" filter="url(#laser)"
                                                initial={{ pathLength: 0 }}
                                                animate={hasStarted ? { pathLength: 1 } : { pathLength: 0 }}
                                                transition={{ duration: journeyPoints.length * 2, ease: "linear" }}
                                            />
                                        </svg>

                                        {journeyPoints.map((point, index) => {
                                            const isRevealed = index <= revealedIndex;
                                            const isJustNow = isPlaying && index === revealedIndex;
                                            const isActive = activePoint?.id === point.id;

                                            return (
                                                <div
                                                    id={`marker-${point.id}`}
                                                    key={`m-${point.id}`}
                                                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 ${isActive || isJustNow ? 'z-[100]' : 'z-30 hover:z-[90]'}`}
                                                    style={{ left: `${point.coords.x}%`, top: `${point.coords.y}%` }}
                                                >
                                                    <div className="absolute -inset-6 cursor-pointer z-40" onClick={() => handleManualClick(point)} />
                                                    <AnimatePresence>
                                                        {isRevealed && (
                                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative w-4 h-4 md:w-5 md:h-5 flex items-center justify-center pointer-events-none">
                                                                {(isActive || isJustNow) && <span className="absolute inset-0 rounded-full bg-yellow-400 animate-ping opacity-75"></span>}
                                                                <div className={`w-full h-full rounded-full border-[1.5px] md:border-2 border-white shadow-xl transition-all ${isActive ? 'bg-yellow-400 scale-125 border-red-700' : 'bg-red-600'}`} />

                                                                <span className={`absolute bottom-6 md:bottom-8 bg-white/95 px-2 md:px-3 py-1 md:py-1.5 z-[999] rounded-md md:rounded-lg shadow-[0_5px_15px_rgba(0,0,0,0.3)] text-[10px] md:text-[12px] font-bold transition-all border border-red-200 whitespace-nowrap ${isJustNow || isActive ? 'opacity-100 translate-y-0 scale-110 text-red-700 ring-2 ring-red-100' : 'opacity-0 md:group-hover:opacity-100 md:group-hover:-translate-y-1'}`}>
                                                                    {point.year} - {point.location.split(',')[0]}
                                                                </span>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </TransformComponent>
                            </React.Fragment>
                        )}
                    </TransformWrapper>

                    {/* BẢNG THÔNG TIN CHI TIẾT DẠNG BOTTOM SHEET TRÊN MOBILE */}
                    <AnimatePresence>
                        {activePoint && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                                className="absolute bottom-0 left-0 right-0 md:top-6 md:left-6 md:bottom-auto md:right-auto md:w-[420px] bg-white rounded-t-2xl md:rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] md:shadow-[0_15px_50px_rgba(0,0,0,0.5)] z-[200] overflow-hidden flex flex-col border-t border-gray-200 md:border max-h-[70%] md:max-h-[85%]"
                            >
                                {/* Thanh vuốt giả trên Mobile */}
                                <div className="w-full flex justify-center py-2 md:hidden absolute top-0 z-50">
                                    <div className="w-10 h-1 bg-white/50 rounded-full"></div>
                                </div>

                                <div className="h-32 md:h-48 relative shrink-0">
                                    <img src={activePoint.image} className="w-full h-full object-cover" alt="Point" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                                    <button onClick={handleCloseCard} className="absolute top-2.5 right-2.5 md:top-4 md:right-4 bg-black/40 text-white p-1.5 md:p-2 rounded-full hover:bg-red-600 transition-colors z-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                    <div className="absolute bottom-3 md:bottom-4 left-4 md:left-5 text-white">
                                        <span className="bg-red-600 px-2 py-0.5 md:px-2.5 md:py-1 text-[9px] md:text-[10px] font-black uppercase rounded mb-1 inline-block">{activePoint.milestone}</span>
                                        <h2 className="text-lg md:text-xl font-black">{activePoint.location}</h2>
                                    </div>
                                </div>
                                <div className="p-4 md:p-6 overflow-y-auto flex-1 bg-white custom-scrollbar">
                                    <div className="flex gap-2 md:gap-3 text-red-700 font-bold text-[10px] md:text-xs mb-3">
                                        <span className="bg-red-50 px-2 py-1 rounded">Năm {activePoint.year}</span>
                                        <span className="bg-red-50 px-2 py-1 rounded">📍 {activePoint.country}</span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-sm md:text-base border-l-4 border-red-700 pl-2 md:pl-3 mb-2">{activePoint.title}</h4>
                                    <p className="text-gray-600 md:text-gray-700 text-[13px] md:text-sm mb-4 text-justify leading-relaxed">{activePoint.desc}</p>
                                    <div className="bg-[#fff9e6] border border-[#fce9a4] p-3 md:p-4 rounded-xl">
                                        <p className="text-yellow-800 text-[11px] md:text-xs font-black uppercase mb-1 italic">Ý nghĩa lịch sử:</p>
                                        <p className="text-gray-800 text-[12px] md:text-[13px] italic leading-relaxed text-justify">"{activePoint.significance}"</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}

export default JourneyMapPage;