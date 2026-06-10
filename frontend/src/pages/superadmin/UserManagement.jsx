import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { HiUsers, HiMagnifyingGlass, HiShieldCheck, HiTrash, HiUserPlus, HiNoSymbol } from 'react-icons/hi2';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { getAllUsers, toggleUserActive, changeUserRole, deleteUser } from '../../api/user.service';

const roleVariant = (role) =>
  role === 'superadmin' ? 'warning' : role === 'admin' ? 'primary' : role === 'member' ? 'success' : 'secondary';

const UserManagement = () => {
  const { user, can } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(true);

  const canEdit = can.editContent;
  const canDelete = can.deleteAdmin; // Only superadmin can delete users essentially

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const toggleStatus = async (id) => {
    try {
      const res = await toggleUserActive(id);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: res.data.data.isActive } : u));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to toggle status');
    }
  };

  const changeRole = async (id, newRole) => {
    try {
      const res = await changeUserRole(id, newRole);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role: res.data.data.role } : u));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to change role');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setUsers(prev => prev.filter(u => u._id !== id));
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const counts = {
    total: users.length,
    superadmin: users.filter(u => u.role === 'superadmin').length,
    admins: users.filter(u => u.role === 'admin').length,
    members: users.filter(u => u.role === 'member').length,
    students: users.filter(u => u.role === 'student').length,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
            <HiUsers className="text-primary" /> User Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage all users, assign roles, and control access.</p>
        </div>
        <a href="/dashboard/admin/add-admin"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm">
          <HiUserPlus className="w-5 h-5" /> Add Admin
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: counts.total, color: 'text-slate-800 dark:text-white' },
          { label: 'Super Admins', value: counts.superadmin, color: 'text-amber-500' },
          { label: 'Admins', value: counts.admins, color: 'text-primary' },
          { label: 'Members', value: counts.members, color: 'text-emerald-500' },
          { label: 'Students', value: counts.students, color: 'text-secondary' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="text-center py-3">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full py-2.5 pl-11 pr-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm" />
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/50">
          <option value="all">All Roles</option>
          <option value="superadmin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
          <option value="student">Student</option>
        </select>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/10 bg-slate-50 dark:bg-slate-900/60">
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase">User</th>
                <th className="px-5 py-4 text-left text-xs font-bold text-slate-400 uppercase hidden sm:table-cell">Email</th>
                <th className="px-5 py-4 text-center text-xs font-bold text-slate-400 uppercase">Role</th>
                <th className="px-5 py-4 text-center text-xs font-bold text-slate-400 uppercase">Status</th>
                <th className="px-5 py-4 text-center text-xs font-bold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/10">
              {filtered.map((u, idx) => {
                return (
                  <motion.tr key={u._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                    className={`transition-colors ${u.isSuperAdminLocked ? 'bg-amber-500/5' : 'hover:bg-slate-50 dark:hover:bg-slate-900/30'}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-sm flex-shrink-0 ${u.isSuperAdminLocked ? 'bg-gradient-to-tr from-amber-400 to-rose-500' : 'bg-gradient-to-tr from-primary to-secondary'}`}>
                          {u.isSuperAdminLocked ? '🔒' : u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white text-sm">{u.name}</p>
                          {u.isSuperAdminLocked && <p className="text-[10px] text-amber-500 font-bold">LOCKED ROLE</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs hidden sm:table-cell">{u.email}</td>
                    <td className="px-5 py-4 text-center">
                      {u.isSuperAdminLocked ? (
                        <Badge variant="warning" className="uppercase text-[10px]">Super Admin</Badge>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => changeRole(u._id, e.target.value)}
                          disabled={!canEdit || (user.role === 'admin' && u.role === 'admin')}
                          className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white border-0 rounded px-2 py-1 outline-none ring-1 ring-slate-200 dark:ring-slate-700"
                        >
                          <option value="student">Student</option>
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {u.isSuperAdminLocked ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <button
                          onClick={() => toggleStatus(u._id)}
                          disabled={!canEdit}
                          className={`text-2xl ${u.isActive === false ? 'text-slate-300 dark:text-slate-600' : 'text-emerald-500'} hover:opacity-75 transition-opacity disabled:opacity-50`}
                        >
                          {u.isActive === false ? <HiNoSymbol /> : <HiShieldCheck />}
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => handleDelete(u._id)}
                        disabled={!canDelete || u.isSuperAdminLocked}
                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent inline-flex"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {loading ? (
            <div className="py-16 text-center text-slate-400">Loading users...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <HiUsers className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No users found</p>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
};

export default UserManagement;
