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
        alert(res.data); // Hiện thông báo thành công
      } catch (err) {
        alert("Lỗi cứu hộ: " + (err.response?.data || "Không thể thực hiện"));
      }
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500 font-['Lora',serif]">Đang tải danh sách nhân sự...</div>;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in font-['Lora',serif]">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight">Quản Lý Nhân Sự</h1>
        <p className="text-gray-500 mt-1 italic">Danh sách cán bộ, giáo viên. Chỉ dùng để cấp lại mật khẩu.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-red-50 border-b border-red-100">
            <tr className="text-red-800 text-xs uppercase font-black tracking-widest">
              <th className="p-5">Họ và Tên</th>
              <th className="p-5">Tên đăng nhập</th>
              <th className="p-5 text-center">Chức vụ</th>
              <th className="p-5 text-center">Thao tác cứu hộ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-red-50/30 transition-colors">
                <td className="p-5 font-bold text-gray-800">{u.fullName}</td>
                <td className="p-5 text-gray-600 font-mono text-sm">{u.username}</td>
                <td className="p-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.role === 'SUPER_ADMIN' ? 'bg-red-700 text-white shadow-md' : 'bg-gray-100 text-gray-600'}`}>
                    {u.role === 'SUPER_ADMIN' ? 'Quản trị tối cao' : 'Quản trị viên'}
                  </span>
                </td>
                <td className="p-5 text-center">
                  {/* Không cho phép Quản trị tối cao tự reset mật khẩu của chính mình ở nút này */}
                  {u.role !== 'SUPER_ADMIN' && (
                    <button 
                      onClick={() => handleReset(u.id, u.fullName)}
                      className="bg-white border-2 border-red-600 text-red-700 hover:bg-red-700 hover:text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm active:scale-95"
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
  );
}