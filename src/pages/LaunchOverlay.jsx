import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

// Nhớ đổi tên file nhạc trong thư mục assets thành nhac-demo.mp3 hoặc sửa link dưới đây
import BackgroundImage from '../assets/bg4.jpeg'; 
import LaunchMusic from '../assets/music-demo.mp3'; 

export default function LaunchOverlay({ onComplete }) {
  const [isActivated, setIsActivated] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  
  // ĐÃ THÊM: Biến trạng thái để khóa hệ thống, chờ click chuột (Lên cò)
  const [isSystemReady, setIsSystemReady] = useState(false);
  
  // đếm 20 nhịp trạng thái (10 lần Sáng + 10 lần Tối = 10 lần nháy)
  const [step, setStep] = useState(0);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  
  const audioRef = useRef(null);

  // HÀM BẮN PHÁO HOA
  const fireConfetti = () => {
    const duration = 4000; 
    const end = Date.now() + duration;
    const colors = ['#da251d', '#ffff00']; 
    (function frame() {
      confetti({ particleCount: 8, angle: 60, spread: 70, origin: { x: 0 }, colors: colors });
      confetti({ particleCount: 8, angle: 120, spread: 70, origin: { x: 1 }, colors: colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  useEffect(() => {
    // ĐÃ THÊM: Nếu chưa click chuột thì không làm gì cả
    if (!isSystemReady) return;

    // Khởi tạo và phát nhạc ngay lập tức
    audioRef.current = new Audio(LaunchMusic);
    audioRef.current.volume = 1.0;
    audioRef.current.play().catch(() => console.log("Cần tương tác để phát nhạc"));

    // Chạy bộ đếm nhịp nháy
    // Tổng 28s: 24s đầu dành cho 10 lần nháy.
    // 24 giây / 20 nhịp = 1.2 giây (1200ms) cho mỗi nhịp Sáng/Tối.
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= 19) { // Chạm mốc 20 nhịp (10 lần nháy)
          clearInterval(interval);
          return 20;
        }
        setIsButtonVisible(v => !v);
        return prev + 1;
      });
    }, 1200); 

    return () => {
      clearInterval(interval);
      if (audioRef.current) audioRef.current.pause();
    };
  }, [isSystemReady]); // ĐÃ SỬA: Lắng nghe sự thay đổi của isSystemReady

  // Tự động kích hoạt khi nháy đủ 10 lần
  useEffect(() => {
    if (step === 20 && !isActivated) {
      handleTrigger();
    }
  }, [step]);

  const handleTrigger = () => {
    setIsActivated(true);
    fireConfetti();

    // Đợi 4 giây cuối của nhạc (để khớp tổng 28s) thì vén màn
    setTimeout(() => {
      setIsHiding(true);
      
      // Hiệu ứng tắt nhạc dần
      const fadeAudio = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.1) {
          audioRef.current.volume -= 0.1;
        } else {
          if (audioRef.current) audioRef.current.pause();
          clearInterval(fadeAudio);
        }
      }, 150);

      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
    }, 4000); 
  };

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-900 transition-all duration-[1500ms] ease-in-out ${isHiding ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
      style={{ backgroundImage: `url(${BackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      {/* === ĐÃ THÊM: MÀN HÌNH "LÊN CÒ" CHẶN TƯƠNG TÁC BẮT ĐẦU === */}
      {!isSystemReady && (
        <div 
          onClick={() => setIsSystemReady(true)}
          className="absolute inset-0 z-[10000] bg-black/80 flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm"
        >
          <div className="animate-pulse flex flex-col items-center text-yellow-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <h1 className="text-3xl font-bold font-['Lora',serif] uppercase tracking-widest text-center px-4">
              Click vào màn hình để bắt đầu sự kiện
            </h1>
          </div>
        </div>
      )}

      {/* TOÀN BỘ GIAO DIỆN CŨ CỦA BẠN ĐƯỢC GIỮ NGUYÊN BÊN DƯỚI */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full">
        <h2 className="text-yellow-400 font-bold uppercase tracking-[0.3em] mb-4 text-xs md:text-base">
          Lễ ra mắt nền tảng
        </h2>
        
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-relaxed md:leading-snug font-['Lora',serif] mb-12 md:mb-24 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
          Không gian văn hoá <br className="hidden md:block" /> Hồ Chí Minh
        </h1>

        <div className={`transition-all duration-700 w-full max-w-[95vw] ${isActivated ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>
          <div className="flex flex-col items-center w-full">
            
            {/* NÚT VÂN TAY PHÓNG TO CHO TIVI */}
            <div className="flex justify-center gap-4 sm:gap-8 md:gap-12 lg:gap-24 xl:gap-32 mb-12 md:mb-20 w-full">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="relative flex flex-col items-center">
                  {/* Hiệu ứng nháy dứt khoát */}
                  <div className={`transition-all duration-1000 ${isButtonVisible ? 'opacity-100 scale-110' : 'opacity-80 scale-100'}`}>
                    <div className="absolute inset-[-15px] md:inset-[-25px] rounded-full bg-yellow-400/30 animate-[ping_3s_infinite]"></div>
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 xl:w-44 xl:h-44 rounded-full border-[3px] md:border-4 border-yellow-400 bg-black/40 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,0,0.5)] z-10 backdrop-blur-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-12 sm:w-12 lg:h-20 lg:w-20 xl:h-24 xl:w-24 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-yellow-400 font-['Lora',serif] italic text-lg md:text-2xl lg:text-3xl font-bold tracking-[0.2em] animate-pulse drop-shadow-md text-center px-4">
              Kính mời các đại biểu đặt tay kích hoạt
            </p>
          </div>
        </div>

        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${isActivated ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none'}`}>
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-black text-yellow-300 uppercase tracking-widest font-['Lora',serif] drop-shadow-[0_0_60px_rgba(255,255,0,0.9)] whitespace-nowrap">
            Kích Hoạt!
          </h2>
        </div>
      </div>
    </div>
  );
}