import React, { useState, useEffect } from 'react';
import api from '../services/api'; 

function VisitorTracker() {
  const [showModal, setShowModal] = useState(false);
  const hasLogged = React.useRef(false);

  useEffect(() => {
    if (hasLogged.current) return;
    hasLogged.current = true;

    const savedRole = localStorage.getItem('visitor_role');
    if (!savedRole) {
      const timer = setTimeout(() => setShowModal(true), 2000);
      return () => clearTimeout(timer);
    } else {
      logVisitToBackend(savedRole);
    }
  }, []);

  const logVisitToBackend = async (role) => {
    try {
      // GỌI API THỰC TẾ: Ghi nhận truy cập
      await api.post('/analytics/visit', { role: role });
    } catch (error) {
      console.error("Lỗi ghi nhận truy cập:", error);
    }
  };

  const handleSelectRole = (role) => {
    localStorage.setItem('visitor_role', role);
    logVisitToBackend(role);
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-[90%] max-w-md transform transition-all scale-100 opacity-100">
        <div className="text-center mb-6">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👋</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 font-['Lora',serif]">Xin chào!</h2>
          <p className="text-gray-500 text-sm mt-2">Để trải nghiệm tốt nhất, xin vui lòng cho biết bạn là:</p>
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={() => handleSelectRole('TEACHER')} className="w-full py-3 px-4 bg-red-50 hover:bg-red-600 hover:text-white text-red-800 font-bold rounded-xl border border-red-100 transition-colors flex items-center justify-center gap-2">👨‍🏫 Giáo viên / Cán bộ</button>
          <button onClick={() => handleSelectRole('STUDENT')} className="w-full py-3 px-4 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-800 font-bold rounded-xl border border-blue-100 transition-colors flex items-center justify-center gap-2">👨‍🎓 Học sinh</button>
          <button onClick={() => handleSelectRole('GUEST')} className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-600 hover:text-white text-gray-800 font-bold rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2">👤 Khách tham quan</button>
        </div>
      </div>
    </div>
  );
}

export default VisitorTracker;