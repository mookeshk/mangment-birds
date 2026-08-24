"use client";

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Icons } from '../../components/Icons';

export default function AdminUsersPage() {
    const { fetchWithAuth } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('الكل');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetchWithAuth('/api/Admin/users');
            if (res.ok) {
                setUsers(await res.json());
            }
        } catch (e) {}
        setIsLoading(false);
    };

    const toggleLock = async (userId: string, currentLockoutEnd: string | null) => {
        try {
            const isLocked = currentLockoutEnd && new Date(currentLockoutEnd) > new Date();
            const res = await fetchWithAuth(`/api/Admin/users/${userId}/lock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(!isLocked)
            });

            if (res.ok) {
                loadUsers();
            }
        } catch (e) {}
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const isLocked = user.lockoutEnd && new Date(user.lockoutEnd) > new Date();
            const status = isLocked ? 'banned' : 'active';
            
            const matchesSearch = (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  (user.farmName || '').includes(searchQuery) ||
                                  (user.contactNumbers || '').includes(searchQuery);
            
            const matchesStatus = filterStatus === 'الكل' || 
                                  (filterStatus === 'نشط' && status === 'active') ||
                                  (filterStatus === 'محظور' && status === 'banned');
                                  
            return matchesSearch && matchesStatus;
        });
    }, [users, searchQuery, filterStatus]);

    if (isLoading) return <div className="text-center p-8 text-emerald-500 font-bold">جاري التحميل...</div>;

    const activeUsersCount = users.filter(user => !(user.lockoutEnd && new Date(user.lockoutEnd) > new Date())).length;

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Users Card */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#334155] flex items-center justify-between group hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors">
                    <div className="flex flex-col">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">إجمالي المستخدمين</p>
                        <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{users.length}</h3>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20 text-blue-500">
                        <Icons.Users className="w-6 h-6" />
                    </div>
                </div>

                {/* Farms Card */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#334155] flex items-center justify-between group hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-colors">
                    <div className="flex flex-col">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">إجمالي المزارع النشطة</p>
                        <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{activeUsersCount}</h3>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20 text-emerald-500">
                        <Icons.Grid className="w-6 h-6" />
                    </div>
                </div>

                {/* Birds Card (Mock stat based on HTML) */}
                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#334155] flex items-center justify-between group hover:border-amber-200 dark:hover:border-amber-500/30 transition-colors">
                    <div className="flex flex-col">
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">إجمالي الطيور في النظام</p>
                        <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">4</h3>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center border border-amber-100 dark:border-amber-500/20 text-amber-500">
                        <Icons.Cloud className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Main Data Table Container */}
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-[#334155] overflow-hidden flex flex-col min-h-[500px]">
                
                {/* Header & Tools */}
                <div className="p-5 border-b border-gray-100 dark:border-[#334155] flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-[#0f172a]/50">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">المستخدمين المسجلين</h2>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        {/* Search Input */}
                        <div className="relative group w-full sm:w-72">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500">
                                <Icons.Search />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pr-10 pl-3 py-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"
                                placeholder="بحث بالبريد أو الاسم أو الهاتف..."
                            />
                        </div>

                        {/* Filter Dropdown */}
                        <div className="relative w-full sm:w-32">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="block w-full px-3 py-2 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm appearance-none cursor-pointer"
                            >
                                <option value="الكل">الكل</option>
                                <option value="نشط">نشط فقط</option>
                                <option value="محظور">محظور فقط</option>
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-[#0f172a]/80 border-b border-gray-100 dark:border-[#334155]">
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">البريد الإلكتروني</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">اسم المزرعة</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap text-center">الهاتف</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap text-center">الحالة</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => {
                                    const isLocked = user.lockoutEnd && new Date(user.lockoutEnd) > new Date();
                                    return (
                                    <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-[#0f172a]/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-300">{user.email}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{user.farmName || 'بدون اسم'}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-600 dark:text-gray-400 font-mono">
                                            {user.contactNumbers || 'لا يوجد'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {!isLocked ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                                                    نشط
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">
                                                    محظور
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {!isLocked ? (
                                                <button 
                                                    onClick={() => toggleLock(user.id, user.lockoutEnd)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 rounded-lg text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                                >
                                                    <Icons.Ban /> حظر الحساب
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => toggleLock(user.id, user.lockoutEnd)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 rounded-lg text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                                >
                                                    <Icons.User /> تفعيل الحساب
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                )})
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        لا يوجد مستخدمين مطابقين للبحث أو الفلتر.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
