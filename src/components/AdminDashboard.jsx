import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  HiAcademicCap,
  HiIdentification,
  HiUserGroup,
  HiLibrary,
  HiSpeakerphone,
  HiSparkles,
  HiStar,
  HiPlus,
  HiDocumentText,
  HiRefresh,
  HiArrowRight,
  HiGlobeAlt,
  HiPrinter,
  HiTrendingUp,
  HiInformationCircle,
  HiCheckCircle,
  HiUsers
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    TOTAL: 0, TEACHER: 0, STUDENT: 0, GUEST: 0, PARTY_MEMBER: 0,
    TOTAL_ARTICLES: 0, ARTICLE_TIN_TUC: 0, ARTICLE_HOC_TAP_BAC: 0
  });

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(null);

  const adminName = localStorage.getItem('adminName') || 'Thầy/Cô';
  const userRole = localStorage.getItem('userRole');

  const fetchStats = async (showToast = false) => {
    try {
      if (showToast) setIsRefreshing(true);
      const response = await api.get('/analytics/summary');
      setStats(response.data || {});
      setLastUpdatedTime(new Date());
      if (showToast) toast.success("Đã làm mới dữ liệu thống kê!");
    } catch (error) {
      console.error("Lỗi lấy dữ liệu thống kê", error);
      if (showToast) toast.error("Không thể tải dữ liệu thống kê!");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Tính phần trăm phân bổ lượt truy cập
  const totalVisits = Number(stats.TOTAL) || 0;
  const studentCount = Number(stats.STUDENT) || 0;
  const teacherCount = Number(stats.TEACHER) || 0;
  const partyCount = Number(stats.PARTY_MEMBER) || 0;
  const guestCount = Number(stats.GUEST) || 0;

  const studentPct = totalVisits > 0 ? Math.round((studentCount / totalVisits) * 100) : 0;
  const teacherPct = totalVisits > 0 ? Math.round((teacherCount / totalVisits) * 100) : 0;
  const partyPct = totalVisits > 0 ? Math.round((partyCount / totalVisits) * 100) : 0;
  const guestPct = totalVisits > 0 ? Math.max(0, 100 - studentPct - teacherPct - partyPct) : 0;

  // Thống kê bài viết
  const totalArticles = Number(stats.TOTAL_ARTICLES) || 0;
  const tinTucCount = Number(stats.ARTICLE_TIN_TUC) || 0;
  const hocTapCount = Number(stats.ARTICLE_HOC_TAP_BAC) || 0;

  const tinTucPct = totalArticles > 0 ? Math.round((tinTucCount / totalArticles) * 100) : 0;
  const hocTapPct = totalArticles > 0 ? Math.max(0, 100 - tinTucPct) : 0;

  const handlePrint = () => {
    window.print();
  };

  const formatLastUpdated = (d) => {
    if (!d) return "Vừa xong";
    const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const date = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${time} - ${date}`;
  };

  if (loading) {
    return (
      <div className="w-full max-w-full space-y-6 font-['Lora',serif] animate-pulse">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs h-32"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-stone-200 p-6 rounded-2xl h-36"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-stone-200 p-6 rounded-2xl h-36"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full space-y-7 animate-fade-in font-['Lora',serif] pb-12">

      {/* HEADER: TIÊU ĐỀ HỆ THỐNG & CÔNG CỤ BÁO CÁO */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans text-emerald-800 bg-emerald-50 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Không gian số trực tuyến
            </span>
            {lastUpdatedTime && (
              <span className="text-[11px] font-sans text-stone-400">
                • Cập nhật: {formatLastUpdated(lastUpdatedTime)}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-snug">
            Trung Tâm Thống Kê & Giám Sát Không Gian
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-sans mt-1">
            Không gian văn hóa Hồ Chí Minh • Trường THPT Thái Phiên - Thăng Bình
          </p>
        </div>

        {/* Các nút công cụ */}
        <div className="flex items-center gap-2 font-sans w-full md:w-auto flex-wrap no-print">
          <button
            type="button"
            disabled={isRefreshing}
            onClick={() => fetchStats(true)}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-stone-50 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-bold border border-stone-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
            title="Làm mới số liệu từ máy chủ"
          >
            <HiRefresh className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-red-700' : 'text-stone-500'}`} />
            <span>Làm mới</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-stone-50 hover:bg-stone-100 text-stone-700 rounded-xl text-xs font-bold border border-stone-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            title="In báo cáo thống kê"
          >
            <HiPrinter className="w-4 h-4 text-stone-500" />
            <span>In báo cáo</span>
          </button>

          <Link
            to="/admin/create-post"
            className="w-full sm:w-auto px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-md"
          >
            <HiPlus className="w-4 h-4" />
            <span>Soạn bài mới</span>
          </Link>
        </div>
      </div>

      {/* KHỐI 1: CHỈ SỐ THAM QUAN & TƯƠNG TÁC (VISITOR METRICS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-stone-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-700"></span>
            1. Tương tác & Đối tượng tham quan Không gian
          </h2>
          <span className="text-xs font-sans font-semibold text-stone-600 bg-white px-3 py-1 rounded-full border border-stone-200 shadow-2xs">
            Tổng tiếp cận: <strong className="text-red-700 font-bold">{totalVisits.toLocaleString('vi-VN')}</strong> lượt
          </span>
        </div>

        {/* 4 Card thống kê theo từng đối tượng */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Học sinh */}
          <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-xs hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-sans font-bold text-blue-700 uppercase tracking-wider">
                Học sinh
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                <HiAcademicCap className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-stone-900 font-sans tracking-tight mb-1">
              {studentCount.toLocaleString('vi-VN')}
            </h3>
            <div className="flex items-center justify-between text-[11px] font-sans text-stone-500">
              <span>Tỷ trọng:</span>
              <strong className="text-blue-700 font-bold">{studentPct}%</strong>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div style={{ width: `${studentPct}%` }} className="bg-blue-600 h-full rounded-full"></div>
            </div>
          </div>

          {/* Giáo viên & Cán bộ */}
          <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-sans font-bold text-emerald-700 uppercase tracking-wider">
                Giáo viên & Cán bộ
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                <HiIdentification className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-stone-900 font-sans tracking-tight mb-1">
              {teacherCount.toLocaleString('vi-VN')}
            </h3>
            <div className="flex items-center justify-between text-[11px] font-sans text-stone-500">
              <span>Tỷ trọng:</span>
              <strong className="text-emerald-700 font-bold">{teacherPct}%</strong>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div style={{ width: `${teacherPct}%` }} className="bg-emerald-600 h-full rounded-full"></div>
            </div>
          </div>

          {/* Đảng viên & Đoàn viên */}
          <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-xs hover:border-red-300 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-sans font-bold text-red-700 uppercase tracking-wider">
                Đảng viên & Đoàn viên
              </span>
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100 shrink-0">
                <HiStar className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-stone-900 font-sans tracking-tight mb-1">
              {partyCount.toLocaleString('vi-VN')}
            </h3>
            <div className="flex items-center justify-between text-[11px] font-sans text-stone-500">
              <span>Tỷ trọng:</span>
              <strong className="text-red-700 font-bold">{partyPct}%</strong>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div style={{ width: `${partyPct}%` }} className="bg-red-700 h-full rounded-full"></div>
            </div>
          </div>

          {/* Khách tham quan & Phụ huynh */}
          <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-xs hover:border-stone-400 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-sans font-bold text-stone-600 uppercase tracking-wider">
                Khách tham quan
              </span>
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center border border-stone-200 shrink-0">
                <HiUserGroup className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-extrabold text-stone-900 font-sans tracking-tight mb-1">
              {guestCount.toLocaleString('vi-VN')}
            </h3>
            <div className="flex items-center justify-between text-[11px] font-sans text-stone-500">
              <span>Tỷ trọng:</span>
              <strong className="text-stone-700 font-bold">{guestPct}%</strong>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div style={{ width: `${guestPct}%` }} className="bg-stone-500 h-full rounded-full"></div>
            </div>
          </div>

        </div>

        {/* BẢNG CƠ CẤU PHÂN BỔ TRỰC QUAN (DETAILED DEMOGRAPHIC BREAKDOWN) */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/80 shadow-xs font-sans">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Biểu đồ cơ cấu thành phần người tham quan
              </h3>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Phân tích lưu lượng tương tác trực tiếp với các tư liệu không gian
              </p>
            </div>
          </div>

          {/* Thanh phân đoạn tỷ lệ chung */}
          <div className="h-3.5 w-full bg-stone-100 rounded-full overflow-hidden flex shadow-inner mb-5">
            <div style={{ width: `${studentPct}%` }} className="bg-blue-600 transition-all" title={`Học sinh: ${studentPct}%`}></div>
            <div style={{ width: `${teacherPct}%` }} className="bg-emerald-600 transition-all" title={`Giáo viên: ${teacherPct}%`}></div>
            <div style={{ width: `${partyPct}%` }} className="bg-red-700 transition-all" title={`Đảng viên: ${partyPct}%`}></div>
            <div style={{ width: `${guestPct}%` }} className="bg-stone-400 transition-all" title={`Khách: ${guestPct}%`}></div>
          </div>

          {/* Bảng so sánh chỉ số chi tiết */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/80">
              <div className="flex items-center justify-between text-xs font-bold text-blue-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> Học sinh
                </span>
                <span>{studentPct}%</span>
              </div>
              <p className="text-[11px] text-blue-700 font-medium">
                {studentCount.toLocaleString('vi-VN')} lượt (Lực lượng nòng cốt)
              </p>
            </div>

            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/80">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Giáo viên
                </span>
                <span>{teacherPct}%</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-medium">
                {teacherCount.toLocaleString('vi-VN')} lượt (Giảng dạy & định hướng)
              </p>
            </div>

            <div className="p-3 bg-red-50/50 rounded-xl border border-red-100/80">
              <div className="flex items-center justify-between text-xs font-bold text-red-900 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-700"></span> Đảng viên
                </span>
                <span>{partyPct}%</span>
              </div>
              <p className="text-[11px] text-red-800 font-medium">
                {partyCount.toLocaleString('vi-VN')} lượt (Sinh hoạt chính trị)
              </p>
            </div>

            <div className="p-3 bg-stone-100/60 rounded-xl border border-stone-200">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-stone-500"></span> Khách tham quan
                </span>
                <span>{guestPct}%</span>
              </div>
              <p className="text-[11px] text-stone-600 font-medium">
                {guestCount.toLocaleString('vi-VN')} lượt (Lan tỏa cộng đồng)
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* KHỐI 2: SỐ HÓA DI SẢN & KHO TƯ LIỆU (DIGITAL ARCHIVE) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold font-sans uppercase tracking-wider text-stone-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-700"></span>
            2. Thống kê Tư liệu số hóa & Bài viết xuất bản
          </h2>
          <Link 
            to="/admin/articles"
            className="text-xs font-sans font-semibold text-red-700 hover:text-red-800 flex items-center gap-1 transition-colors"
          >
            <span>Xem tất cả danh mục</span> <HiArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Tổng tư liệu bài viết */}
          <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-sans font-bold text-stone-500 uppercase tracking-wider">
                Tổng kho bài viết
              </span>
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center border border-stone-200 shrink-0">
                <HiLibrary className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-stone-900 font-sans tracking-tight mb-1">
                {totalArticles.toLocaleString('vi-VN')}
              </h3>
              <p className="text-[11px] text-stone-400 font-sans">
                Đã hoàn tất biên tập và đăng tải
              </p>
            </div>
          </div>

          {/* Tin tức sự kiện */}
          <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-sans font-bold text-red-700 uppercase tracking-wider">
                Tin tức - Hoạt động
              </span>
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center border border-red-100 shrink-0">
                <HiSpeakerphone className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-red-700 font-sans tracking-tight mb-1">
                {tinTucCount.toLocaleString('vi-VN')}
              </h3>
              <div className="flex items-center justify-between text-[11px] font-sans text-stone-500 mt-1">
                <span>Chiếm tỷ lệ:</span>
                <strong className="text-red-700 font-bold">{tinTucPct}%</strong>
              </div>
              <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div style={{ width: `${tinTucPct}%` }} className="bg-red-600 h-full rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Học tập tư tưởng Bác */}
          <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-sans font-bold text-amber-700 uppercase tracking-wider">
                Học tập & Làm theo Bác
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 shrink-0">
                <HiSparkles className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-amber-700 font-sans tracking-tight mb-1">
                {hocTapCount.toLocaleString('vi-VN')}
              </h3>
              <div className="flex items-center justify-between text-[11px] font-sans text-stone-500 mt-1">
                <span>Chiếm tỷ lệ:</span>
                <strong className="text-amber-700 font-bold">{hocTapPct}%</strong>
              </div>
              <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div style={{ width: `${hocTapPct}%` }} className="bg-amber-600 h-full rounded-full"></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* KHỐI 3: ĐÁNH GIÁ MỨC ĐỘ LAN TỎA GIÁO DỤC (EDUCATIONAL IMPACT ASSESSMENT) */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 p-6 sm:p-7 rounded-3xl text-white shadow-md relative overflow-hidden font-sans">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <HiTrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Đánh giá mức độ lan tỏa văn hóa học đường
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-['Lora',serif] mb-2">
              Không gian số hóa phát huy hiệu quả tích cực trong giáo dục truyền thống
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Học sinh và giáo viên chiếm <strong className="text-white font-bold">{studentPct + teacherPct}%</strong> trên tổng số lượt truy cập. Việc tích hợp sách lật 3D, bản đồ hành trình và tư liệu số đã giúp việc học tập tư tưởng Hồ Chí Minh trở nên tự nhiên, hứng khởi và khắc sâu vào nếp sinh hoạt học đường.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="text-center">
              <span className="text-[10px] uppercase text-stone-300 font-bold tracking-wider block">Tiếp cận học đường</span>
              <strong className="text-2xl font-black text-emerald-300">{studentPct + teacherPct}%</strong>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="text-center">
              <span className="text-[10px] uppercase text-stone-300 font-bold tracking-wider block">Tư liệu đã số</span>
              <strong className="text-2xl font-black text-amber-300">{totalArticles}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* KHỐI 4: LỐI TẮT NGHIỆP VỤ QUẢN TRỊ (QUICK ACTIONS) */}
      <div className="bg-stone-50/80 border border-stone-200/80 p-5 sm:p-6 rounded-3xl font-sans no-print">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 flex items-center gap-2">
          <span>Lối tắt quản trị nghiệp vụ</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <Link
            to="/admin/create-post"
            className="p-3.5 bg-white border border-stone-200 rounded-xl hover:border-red-300 hover:shadow-xs transition-all flex items-center gap-3 text-stone-700 hover:text-red-700 group"
          >
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0 group-hover:bg-red-700 group-hover:text-white transition-colors">
              <HiPlus className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold leading-tight">Soạn bài viết mới</h4>
              <p className="text-[11px] text-stone-400 mt-0.5">Trình soạn thảo chuẩn</p>
            </div>
          </Link>

          <Link
            to="/admin/articles"
            className="p-3.5 bg-white border border-stone-200 rounded-xl hover:border-red-300 hover:shadow-xs transition-all flex items-center gap-3 text-stone-700 hover:text-red-700 group"
          >
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 group-hover:bg-stone-800 group-hover:text-white transition-colors">
              <HiDocumentText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold leading-tight">Quản lý bài đã đăng</h4>
              <p className="text-[11px] text-stone-400 mt-0.5">Tìm, sửa & kiểm duyệt</p>
            </div>
          </Link>

          {userRole === 'SUPER_ADMIN' && (
            <Link
              to="/admin/users"
              className="p-3.5 bg-white border border-stone-200 rounded-xl hover:border-red-300 hover:shadow-xs transition-all flex items-center gap-3 text-stone-700 hover:text-red-700 group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                <HiUsers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">Quản lý nhân sự</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">Cấp quyền & bảo mật</p>
              </div>
            </Link>
          )}

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-white border border-stone-200 rounded-xl hover:border-red-300 hover:shadow-xs transition-all flex items-center gap-3 text-stone-700 hover:text-red-700 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <HiGlobeAlt className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold leading-tight">Xem Không Gian Web</h4>
              <p className="text-[11px] text-stone-400 mt-0.5">Mở giao diện bạn đọc</p>
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
}