import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    MdSearch,
    MdEdit,
    MdDelete,
    MdClose,
    MdPerson,
    MdAdminPanelSettings,
    MdBlock
} from 'react-icons/md';

const UserManagement = () => {
    const { getToken } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [roleFilter, setRoleFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (res.ok) {
                // Map backend data to frontend format
                const formattedUsers = data.map(user => ({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role === 'admin' ? 'Admin' : 'Customer',
                    status: 'Active', // Mocking status for UI until backend supports it
                    orders: 0, // Mocking until robust order backend
                    spent: 0,
                    joined: new Date(user.createdAt).toISOString().split('T')[0],
                    avatar: user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                }));
                setUsers(formattedUsers);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const roles = ['All', 'Admin', 'Customer'];
    const statuses = ['Active', 'Inactive', 'Banned'];

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Inactive': return 'bg-yellow-100 text-yellow-700';
            case 'Banned': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getRoleColor = (role) => {
        return role === 'Admin'
            ? 'bg-purple-100 text-purple-700'
            : 'bg-blue-100 text-blue-700';
    };

    const getAvatarGradient = (name) => {
        const gradients = [
            'from-pink-500 to-rose-500',
            'from-violet-500 to-purple-500',
            'from-blue-500 to-cyan-500',
            'from-emerald-500 to-teal-500',
            'from-orange-500 to-amber-500',
        ];
        const index = name.charCodeAt(0) % gradients.length;
        return gradients[index];
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({ role: newRole === 'Admin' ? 'admin' : 'customer' })
            });

            if (res.ok) {
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, role: newRole } : user
                ));
                if (selectedUser?.id === userId) {
                    setSelectedUser({ ...selectedUser, role: newRole });
                }
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to update user role');
            }
        } catch (error) {
            console.error('API Error:', error);
        }
    };

    const updateUserStatus = (userId, newStatus) => {
        // Mocking user status switch since backend schema doesn't have it yet
        setUsers(users.map(user =>
            user.id === userId ? { ...user, status: newStatus } : user
        ));
        if (selectedUser?.id === userId) {
            setSelectedUser({ ...selectedUser, status: newStatus });
        }
    };

    const deleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                });

                if (res.ok) {
                    setUsers(users.filter(user => user.id !== userId));
                    setSelectedUser(null);
                } else {
                    const data = await res.json();
                    alert(data.message || 'Failed to delete user');
                }
            } catch (error) {
                console.error('API Error:', error);
            }
        }
    };

    return (
        <div className="p-6 lg:p-8 space-y-6 bg-white min-h-screen">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                <p className="text-gray-500 mt-1">Manage customer accounts and permissions</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
                    <p className="text-2xl font-black text-gray-900">{users.length}</p>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Users</p>
                </div>
                <div className="p-4 rounded-xl bg-green-50 border border-green-100 shadow-sm">
                    <p className="text-2xl font-black text-green-700">{users.filter(u => u.status === 'Active').length}</p>
                    <p className="text-sm font-bold text-green-600 uppercase tracking-wider">Active Users</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 shadow-sm">
                    <p className="text-2xl font-black text-purple-700">{users.filter(u => u.role === 'Admin').length}</p>
                    <p className="text-sm font-bold text-purple-600 uppercase tracking-wider">Admins</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 shadow-sm">
                    <p className="text-2xl font-black text-blue-700">{users.filter(u => u.role === 'Customer').length}</p>
                    <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">Customers</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-tss-red transition-all"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:border-tss-red transition-all font-bold"
                >
                    {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user) => (
                    <div
                        key={user.id}
                        className="p-5 rounded-xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(user.name)} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                <span className="text-white font-bold text-sm tracking-widest">{user.avatar}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-gray-900 font-bold truncate">{user.name}</p>
                                    <span className={`px-2 py-0.5 rounded-sm text-xs font-bold uppercase tracking-wider ${getRoleColor(user.role)}`}>
                                        {user.role}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className={`px-2 py-0.5 rounded-sm text-xs font-bold uppercase tracking-wider ${getStatusColor(user.status)}`}>
                                        {user.status}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{user.orders} orders</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => setSelectedUser(user)}
                                className="flex-1 py-2 text-sm text-gray-700 hover:text-tss-red hover:bg-red-50 rounded-md transition-colors font-bold uppercase tracking-widest"
                            >
                                View Details
                            </button>
                            <button
                                onClick={() => deleteUser(user.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                                <MdDelete size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
                    <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-black uppercase tracking-wider text-gray-900">User Details</h2>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <MdClose size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* User Avatar and Info */}
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${getAvatarGradient(selectedUser.name)} flex items-center justify-center mb-4 shadow-md`}>
                                    <span className="text-white font-black text-2xl tracking-widest">{selectedUser.avatar}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                                <p className="text-gray-500">{selectedUser.email}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-3 py-1 rounded-sm text-sm font-bold uppercase tracking-wider ${getRoleColor(selectedUser.role)}`}>
                                        {selectedUser.role}
                                    </span>
                                    <span className={`px-3 py-1 rounded-sm text-sm font-bold uppercase tracking-wider ${getStatusColor(selectedUser.status)}`}>
                                        {selectedUser.status}
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 p-4 rounded-md bg-gray-50 border border-gray-100">
                                <div className="text-center">
                                    <p className="text-xl font-black text-gray-900">{selectedUser.orders}</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Orders</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-black text-tss-red">₹{selectedUser.spent}</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Spent</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-black text-gray-900">{selectedUser.joined}</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Joined</p>
                                </div>
                            </div>

                            {/* Role Management */}
                            <div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Change Role</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateUserRole(selectedUser.id, 'Customer')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-bold transition-all ${selectedUser.role === 'Customer'
                                            ? 'bg-tss-red text-white'
                                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                            }`}
                                    >
                                        <MdPerson size={18} />
                                        Customer
                                    </button>
                                    <button
                                        onClick={() => updateUserRole(selectedUser.id, 'Admin')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-bold transition-all ${selectedUser.role === 'Admin'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                            }`}
                                    >
                                        <MdAdminPanelSettings size={18} />
                                        Admin
                                    </button>
                                </div>
                            </div>

                            {/* Status Management */}
                            <div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-3">Account Status</p>
                                <div className="flex gap-2">
                                    {statuses.map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => updateUserStatus(selectedUser.id, status)}
                                            className={`flex-1 py-2.5 rounded-md text-sm font-bold transition-all ${selectedUser.status === status
                                                ? status === 'Banned' ? 'bg-red-600 text-white' : 'bg-tss-red text-white'
                                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Delete Button */}
                            <button
                                onClick={() => deleteUser(selectedUser.id)}
                                className="w-full py-3 flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md font-bold uppercase tracking-widest transition-colors"
                            >
                                <MdDelete size={18} />
                                Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
