import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiShieldCheck, 
  HiUser, 
  HiKey, 
  HiExclamation,
  HiUserGroup,
  HiCheck
} from 'react-icons/hi';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal reset mật khẩu
  const [userToReset, setUserToReset] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(res.data || []);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data || "Không có quyền truy cập dữ liệu nhân sự!";
      toast.error(typeof errMsg === 'string' ? errMsg : "Lỗi tải dữ liệu nhân sự");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    if (!userToReset) return;
    setIsResetting(true);
    try {
      const res = await api.put(`/users/${userToReset.id}/reset-password`);
      toast.success(res.data || `Đã đặt lại mật khẩu mặc định (Thaiphien@123) cho ${userToReset.fullName}!`);
      setUserToReset(null);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data || "Không thể thực hiện đặt lại mật khẩu!";
      toast.error(typeof errMsg === 'string' ? errMsg : "Lỗi đặt lại mật khẩu");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="w-full max-w-full font-['Lora',serif] animate-fade-in pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <span className="text-[11px] font-sans font-bold text-red-700 tracking-wider uppercase bg-red-50 px-2.5 py-1 rounded-full border border-red-100 inline-block mb-2">
            Đặc quyền Quản trị tối cao
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
            Quản Lý Nhân Sự
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-sans mt-1">
            Danh sách cán bộ, giáo viên có quyền biên tập nội dung trên hệ thống.
          </p>
        </div>

        <div className="px-4 py-2 bg-white rounded-2xl border border-stone-200/80 shadow-2xs font-sans text-xs text-stone-600 flex items-center gap-2">
          <HiUserGroup className="w-4 h-4 text-stone-400" />
          <span>Tổng số: <strong className="text-red-700 font-bold">{users.length}</strong> tài khoản</span>
        </div>
      </div>

      {/* BẢNG DANH SÁCH NHÂN SỰ */}
      <div className="bg-white rounded-3xl shadow-xs border border-stone-200/80 overflow-hidden font-sans">
        {loading ? (
          <div className="py-16 text-center text-stone-400 font-semibold text-xs tracking-wider animate-pulse flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải danh sách nhân sự...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-stone-400 text-xs">
            Chưa có tài khoản nào trong hệ thống.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200/80 text-stone-500 text-[11px] uppercase font-bold tracking-wider">
                  <th className="py-3.5 px-4 pl-6">Họ và Tên</th>
                  <th className="py-3.5 px-4">Tên đăng nhập</th>
                  <th className="py-3.5 px-4 text-center">Vai trò quản trị</th>
                  <th className="py-3.5 px-4 pr-6 text-center w-48">Thao tác cứu hộ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                    
                    {/* Họ và tên + avatar chữ cái */}
                    <td className="py-3.5 px-4 pl-6 font-bold text-stone-900 font-['Lora',serif]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 font-sans font-bold text-xs flex items-center justify-center border border-stone-200 shrink-0">
                          {(u.fullName || u.username || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-sm">{u.fullName || "Chưa đặt tên"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Username */}
                    <td className="py-3.5 px-4 text-stone-600 font-mono text-xs">
                      @{u.username}
                    </td>

                    {/* Role badge */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {u.role === 'SUPER_ADMIN' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-red-700 bg-red-50 border border-red-200">
                          <HiShieldCheck className="w-3.5 h-3.5 text-red-600" />
                          Quản trị tối cao
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-stone-700 bg-stone-100 border border-stone-200">
                          <HiUser className="w-3.5 h-3.5 text-stone-400" />
                          Quản trị viên
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 pr-6 text-center">
                      {u.role !== 'SUPER_ADMIN' ? (
                        <button
                          type="button"
                          onClick={() => setUserToReset(u)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-stone-200 text-stone-700 hover:text-red-700 hover:border-red-300 hover:bg-red-50/50 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95 whitespace-nowrap"
                        >
                          <HiKey className="w-3.5 h-3.5 text-amber-600" />
                          <span>Cấp lại mật khẩu</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">
                          Tài khoản chính
                        </span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL XÁC NHẬN RESET MẬT KHẨU */}
      <AnimatePresence>
        {userToReset && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-200"
            >
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4 border border-amber-100">
                <HiKey className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-stone-900 text-base mb-2 font-['Lora',serif]">
                Cấp lại mật khẩu mặc định
              </h3>

              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                Xác nhận đặt lại mật khẩu cho tài khoản <strong className="text-stone-900">{userToReset.fullName}</strong> (@{userToReset.username})?
              </p>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl mb-6 text-xs text-amber-900">
                Mật khẩu mới sẽ được đặt về: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 ml-1">Thaiphien@123</strong>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={() => setUserToReset(null)}
                  className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={handleConfirmReset}
                  className="py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isResetting ? 'Đang cấp lại...' : 'Xác nhận cấp lại'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}