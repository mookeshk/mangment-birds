"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import AIAssistant from "../../components/AIAssistant";
import { AIFarmAssistant } from "../../components/AIFarmAssistant";
import NotificationsDropdown from "../../components/NotificationsDropdown";

const Icons = {
    Leaf: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 2C15.5 2 13.5 3 12 4.5C10.5 3 8.5 2 6.5 2C3 2 1 5 1 8.5C1 13 6.5 18 12 22C17.5 18 23 13 23 8.5C23 5 21 2 17.5 2ZM12 19.5C8 16.5 3 12 3 8.5C3 6.5 4.5 5 6.5 5C8 5 9.5 6 10.5 7L12 8.5L13.5 7C14.5 6 16 5 17.5 5C19.5 5 21 6.5 21 8.5C21 12 16 16.5 12 19.5Z"/></svg>,
    Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Bird: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
    Egg: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    Heart: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    Grid: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Wheat: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    Money: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Settings: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Sun: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Moon: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
    Menu: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
    Bell: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    User: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    Logout: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const [isDark, setIsDark] = useState(false);
    useEffect(() => { const saved = localStorage.getItem('theme'); if (saved) setIsDark(saved === 'dark'); }, []);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push("/");
        }
    }, [user, router]);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    if (!user) return null;

    const navItems = [
        { id: 'dashboard', label: 'لوحة التحكم', icon: <Icons.Dashboard />, path: '/dashboard' },
        { id: 'birds', label: 'إدارة الطيور', icon: <Icons.Bird />, path: '/dashboard/birds' },
        { id: 'cages', label: 'المطاير والأقفاص', icon: <Icons.Grid />, path: '/dashboard/cages' },
        { id: 'breeding', label: 'التزاوج والتفريخ', icon: <Icons.Egg />, path: '/dashboard/breeding' },
        { id: 'health', label: 'الصحة، العلاجات، والتغذية', icon: <Icons.Heart />, path: '/dashboard/health' },
        { id: 'inventory', label: 'المخزون والعلف', icon: <Icons.Wheat />, path: '/dashboard/inventory' },
        { id: 'finance', label: 'الماليات', icon: <Icons.Money />, path: '/dashboard/finance' },
        { id: 'settings', label: 'الإعدادات', icon: <Icons.Settings />, path: '/dashboard/settings' },
    ];

    const getPageTitle = () => {
        const current = navItems.find(item => item.path === pathname || (item.path !== '/dashboard' && pathname.startsWith(item.path)));
        return current ? current.label : 'لوحة التحكم';
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 right-0 z-40 w-64 bg-white dark:bg-slate-800 border-l border-gray-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-slate-700 shrink-0">
                        <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsSidebarOpen(false)}>
                            {user?.farmLogoUrl ? <img src={user.farmLogoUrl} alt="Logo" className="w-8 h-8 rounded-full object-cover" /> : <Icons.Leaf />}
                            <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white">
                                {user?.farmName || "مزرعتي"} <span className="text-emerald-500">.</span>
                            </span>
                        </Link>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        <p className="px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4">نظام المزرعة</p>
                        {navItems.map(item => {
                            const isActive = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path));
                            return (
                                <Link 
                                    key={item.id} 
                                    href={item.path} 
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium ${isActive ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-gray-200'}`}
                                >
                                    <span className={isActive ? 'text-emerald-500' : 'text-gray-400'}>{item.icon}</span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                    
                    {/* User Profile Snippet */}
                    <div className="p-4 border-t border-gray-100 dark:border-slate-700 shrink-0">
                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-700/30 cursor-default">
                            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                                {user.farmName?.charAt(0) || 'م'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.farmName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Top Header */}
                <header className="h-16 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-700 z-30 flex justify-between items-center px-4 sm:px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none">
                            <Icons.Menu />
                        </button>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">
                            {getPageTitle()}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <NotificationsDropdown />
                        <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-400 transition-colors">
                            {isDark ? <Icons.Sun /> : <Icons.Moon />}
                        </button>
                        
                        {/* User Menu Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                                className="flex items-center gap-2 p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-400 transition-colors focus:outline-none"
                            >
                                <Icons.User />
                            </button>
                            
                            {isUserMenuOpen && (
                                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 py-1 z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                                        <p className="text-sm text-gray-900 dark:text-white truncate font-bold">{user.farmName}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full text-right px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 flex items-center transition-colors font-medium"
                                    >
                                        <Icons.Logout />
                                        تسجيل الخروج
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-900">
                    {children}
                </div>
                <AIFarmAssistant />
            </main>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 dark:bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
            
            <AIAssistant />
        </div>
    );
}





