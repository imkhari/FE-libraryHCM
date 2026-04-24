import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { 
  HiAcademicCap, 
  HiIdentification, 
  HiUser, 
  HiStar, 
  HiSparkles 
} from 'react-icons/hi';

function VisitorTracker() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Lấy role từ localStorage (sống vĩnh viễn)
    const savedRole = localStorage.getItem('visitor_role');
    
    // Kiểm tra xem Tab này đã đếm view chưa (chỉ sống trong 1 phiên, F5 không bị mất)
    const alreadyLoggedThisSession = sessionStorage.getItem('has_logged_visit');
    
    if (!savedRole) {
      // Nếu chưa từng chọn Role -> Đợi 3s rồi mở Popup
      const timer = setTimeout(() => setShowModal(true), 3000);
      return () => clearTimeout(timer);
    } else {
      // Đã có Role, nhưng tab này chưa đếm view -> Ghi nhận view và khóa lại
      if (!alreadyLoggedThisSession) {
        sessionStorage.setItem('has_logged_visit', 'true'); // Khóa ngay lập tức
        logVisitToBackend(savedRole);
      }
    }
  }, []);

  const logVisitToBackend = async (role) => {
    try {
      await api.post('/analytics/visit', { role: role });
    } catch (error) {
      console.error("Lỗi ghi nhận truy cập:", error);
    }
  };

  const handleSelectRole = (role) => {
    localStorage.setItem('visitor_role', role);
    sessionStorage.setItem('has_logged_visit', 'true'); // Khóa luôn khi vừa chọn xong
    logVisitToBackend(role);
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-[90%] max-w-md transform transition-all scale-100 opacity-100 border border-slate-100">
        
        {/* Phần Header của Popup */}
        <div className="text-center mb-6">
          <div className="bg-amber-50 text-amber-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-amber-100">
            <HiSparkles className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Xin chào!</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Để trải nghiệm tốt nhất, xin vui lòng cho biết bạn là:</p>
        </div>

        {/* CÁC NÚT CHỌN ROLE */}
        <div className="flex flex-col gap-3">
          
          <button 
            onClick={() => handleSelectRole('PARTY_MEMBER')} 
            className="w-full py-3.5 px-4 bg-red-50 hover:bg-red-600 hover:text-white text-red-700 font-bold tracking-wide rounded-xl border border-red-100 hover:border-red-600 transition-all flex items-center gap-3 shadow-sm group"
          >
             <HiStar className="w-6 h-6 text-red-500 group-hover:text-white transition-colors" /> 
             Đảng viên
          </button>

          <button 
            onClick={() => handleSelectRole('TEACHER')} 
            className="w-full py-3.5 px-4 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold tracking-wide rounded-xl border border-emerald-100 hover:border-emerald-600 transition-all flex items-center gap-3 shadow-sm group"
          >
             <HiIdentification className="w-6 h-6 text-emerald-500 group-hover:text-white transition-colors" /> 
             Giáo viên / Cán bộ
          </button>

          <button 
            onClick={() => handleSelectRole('STUDENT')} 
            className="w-full py-3.5 px-4 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold tracking-wide rounded-xl border border-blue-100 hover:border-blue-600 transition-all flex items-center gap-3 shadow-sm group"
          >
             <HiAcademicCap className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" /> 
             Học sinh / Sinh viên
          </button>

          <button 
            onClick={() => handleSelectRole('GUEST')} 
            className="w-full py-3.5 px-4 bg-slate-50 hover:bg-slate-600 hover:text-white text-slate-700 font-bold tracking-wide rounded-xl border border-slate-200 hover:border-slate-600 transition-all flex items-center gap-3 shadow-sm group"
          >
             <HiUser className="w-6 h-6 text-slate-500 group-hover:text-white transition-colors" /> 
             Khách tham quan
          </button>

        </div>
      </div>
    </div>
  );
}

export default VisitorTracker;