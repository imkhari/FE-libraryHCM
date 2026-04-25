import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      alert("Lỗi tải dữ liệu: " + (err.response?.data || "Không có quyền truy cập"));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (id, name) => {
    if (window.confirm(`Xác nhận cấp lại mật khẩu mặc định (Thaiphien@123) cho Thầy/Cô ${name}?`)) {
      try {
        const res = await api.put(`/users/${id}/reset-password`);
        alert(res.data); 
      } catch (err) {
        alert("Lỗi cứu hộ: " + (err.response?.data || "Không thể thực hiện"));
      }
    }
  };

  if (loading) return (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-pulse text-sm font-bold text-slate-400 tracking-widest uppercase">Đang tải danh sách nhân sự...</div>
    </div>
  );

  return (
    <div className="w-full max-w-full animate-fade-in font-['Lora',serif]">
      
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Quản Lý Nhân Sự</h1>
        <p className="text-sm text-slate-500 mt-1">Danh sách cán bộ, giáo viên. Chỉ dùng để cấp lại mật khẩu.</p>
      </div>

      {/* Bảng Dữ liệu Responsive */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] uppercase font-black tracking-wider">
                <th className="p-4 pl-6">Họ và Tên</th>
                <th className="p-4">Tên đăng nhập</th>
                <th className="p-4 text-center">Chức vụ</th>
                <th className="p-4 text-center pr-6">Thao tác cứu hộ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors text-sm">
                  <td className="p-4 pl-6 font-bold text-slate-800">{u.fullName}</td>
                  <td className="p-4 text-slate-500 font-mono text-sm">{u.username}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${u.role === 'SUPER_ADMIN' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                      {u.role === 'SUPER_ADMIN' ? 'Quản trị tối cao' : 'Quản trị viên'}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-center">
                    {/* Không cho phép Quản trị tối cao tự reset mật khẩu của chính mình ở nút này */}
                    {u.role !== 'SUPER_ADMIN' && (
                      <button 
                        onClick={() => handleReset(u.id, u.fullName)}
                        className="bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap"
                      >
                        RESET MẬT KHẨU
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}