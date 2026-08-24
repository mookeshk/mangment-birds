"use client";

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icons } from '../../components/Icons';
import { useAuth } from '../../contexts/AuthContext';
import { AISuperAdminAssistant } from '../../components/AISuperAdminAssistant';

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { user, isLoading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    useEffect(() => {
        if (!isLoading && pathname !== '/admin/login') {
            if (!user || !user.isAdmin) {
                router.push('/admin/login');
            }
        }
    }, [isLoading, user, pathname, router]);

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        const isNowDark = document.documentElement.classList.contains('dark');
        setIsDark(isNowDark);
        localStorage.setItem('theme', isNowDark ? 'dark' : 'light');
    };

    // If it's the login page, just render children without sidebar
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (isLoading) {
        return <div className="h-screen bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center text-emerald-500 font-bold">جاري التحميل...</div>;
    }

    if (!user || !user.isAdmin) {
        return null;
    }

    const navItems = [
        { id: 'users', label: 'إدارة المستخدمين', icon: <Icons.User />, href: '/admin', active: pathname === '/admin' },
        { id: 'packages', label: 'إدارة الباقات', icon: <Icons.Packages />, href: '/admin/packages', active: pathname === '/admin/packages' },
        { id: 'requests', label: 'طلبات الاشتراك', icon: <Icons.List />, href: '/admin/requests', active: pathname === '/admin/requests' },
        { id: 'return', label: 'العودة للمزرعة', icon: <Icons.Return />, href: '/dashboard', active: false },
        { id: 'password', label: 'تغيير كلمة المرور', icon: <Icons.Lock />, href: '/dashboard/settings', active: false },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300" dir="rtl">
            {/* Sidebar - Customized for Super Admin */}
            <aside className={`fixed inset-y-0 right-0 z-40 w-64 bg-white dark:bg-[#1e293b] border-l border-gray-200 dark:border-[#334155] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="h-20 flex items-center justify-center px-6 border-b border-gray-100 dark:border-[#334155]">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
                            <Icons.SettingsCog className="w-6 h-6" />
                            <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
                                لوحة الإدارة <span className="text-emerald-500">.</span>
                            </span>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navItems.map(item => (
                            <Link key={item.id} href={item.href} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium ${item.active ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#0f172a] hover:text-gray-900 dark:hover:text-gray-200'}`}>
                                <span className={item.active ? 'text-emerald-500' : 'text-gray-400'}>{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    
                    {/* Logout Area */}
                    <div className="p-4 border-t border-gray-100 dark:border-[#334155]">
                        <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 rounded-xl transition-colors text-sm font-bold">
                            <Icons.Logout /> تسجيل الخروج
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header */}
                <header className="h-20 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md border-b border-gray-200 dark:border-[#334155] z-30 flex justify-between items-center px-4 sm:px-8 sticky top-0 transition-colors">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:border-[#334155] focus:outline-none">
                            <Icons.Menu />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">نظام الإدارة الشامل</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleTheme} className="p-2.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-[#334155] dark:text-gray-400 transition-colors bg-white dark:bg-[#1e293b] shadow-sm border border-gray-200 dark:border-gray-700">
                            {isDark ? <Icons.Sun /> : <Icons.Moon />}
                        </button>
                        <div className="hidden sm:flex items-center gap-3 border-r border-gray-200 dark:border-[#334155] pr-4">
                            <div className="text-left">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">مرحباً، أيها المدير</p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                                SA
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/50 dark:bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
            <AISuperAdminAssistant />
        </div>
    );
}
