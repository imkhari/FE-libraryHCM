import React, { useState, useRef, useEffect } from 'react';
import { HiVolumeUp, HiPlay, HiPause, HiStop } from 'react-icons/hi';
import api from '../services/api'; // 🌟 Nhớ đảm bảo đường dẫn import api này đúng nhé

export default function TextToSpeech({ textContent }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Thêm state chờ AI xử lý
  
  const [audioUrl, setAudioUrl] = useState(null);
  const audioRef = useRef(null);

  // Dọn dẹp tắt âm thanh nếu người dùng thoát sang trang khác
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = async () => {
    if (!textContent) return;

    // 1. Nếu đang tạm dừng -> Phát tiếp
    if (audioRef.current && isPaused) {
      audioRef.current.play();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    // 2. Nếu đã có file âm thanh sẵn (vừa đọc xong) -> Tua lại từ đầu và phát
    if (audioRef.current && !isSpeaking) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsSpeaking(true);
      return;
    }

    // 3. Lần đầu tiên bấm -> Gọi Backend nhờ FPT đọc
    try {
      setIsLoading(true);
      
      // Xóa bỏ các thẻ HTML để AI không đọc chữ "thẻ p", "thẻ b"
      const plainText = textContent
        .replace(/<[^>]*>?/gm, '')
        .replace(/&nbsp;/g, ' ')
        .trim();

      // Gọi API lên Spring Boot (endpoint bạn vừa tạo ở TtsController)
      const res = await api.post('/tts/synthesize', { text: plainText });
      
      // FPT.AI v5 trả về link mp3 trong trường 'async'
      if (res.data && res.data.async) {
        const linkMp3 = res.data.async;
        setAudioUrl(linkMp3);
        
        // Tạo trình phát nhạc MP3 ẩn
        const audio = new Audio(linkMp3);
        audioRef.current = audio;
        
        // Sự kiện khi đọc xong
        audio.onended = () => {
          setIsSpeaking(false);
          setIsPaused(false);
        };

        audio.play();
        setIsSpeaking(true);
        setIsPaused(false);
      }
    } catch (error) {
      console.error("Lỗi khi kết nối FPT.AI:", error);
      alert("Không thể tải giọng đọc AI lúc này. Vui lòng thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Tua lại từ đầu
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 shadow-sm">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#cc0000] shadow-sm border border-red-100 shrink-0">
          <HiVolumeUp className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-800 font-['Lora',serif]">Nghe bài báo này</h3>
          <p className="text-xs text-gray-500">Giọng đọc: Nam miền Bắc (Lê Minh)</p>
        </div>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        {!isSpeaking ? (
          <button 
            onClick={handlePlay}
            disabled={isLoading}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-white text-xs font-bold rounded-lg transition shadow-md ${isLoading ? 'bg-red-400 cursor-wait' : 'bg-[#cc0000] hover:bg-red-800'}`}
          >
            {isLoading ? (
              <span className="animate-pulse">⏳ ĐANG XỬ LÝ...</span>
            ) : (
              <><HiPlay className="w-4 h-4" /> BẮT ĐẦU ĐỌC</>
            )}
          </button>
        ) : (
          <button 
            onClick={handlePause}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-yellow-500 text-white text-xs font-bold rounded-lg hover:bg-yellow-600 transition shadow-md"
          >
            <HiPause className="w-4 h-4" /> TẠM DỪNG
          </button>
        )}
        
        {(isSpeaking || isPaused) && (
          <button 
            onClick={handleStop}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-300 transition"
          >
            <HiStop className="w-4 h-4" /> DỪNG HẲN
          </button>
        )}
      </div>
    </div>
  );
}