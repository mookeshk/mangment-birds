"use client";
import React, { useEffect, useState } from 'react';
import * as Icons from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardPage() {
    const { user, fetchWithAuth } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        if (!user) return;
        
        const loadStats = async () => {
                        try {
                const [statsRes, notifRes] = await Promise.all([
                    fetchWithAuth('/api/dashboard/stats'),
                    fetchWithAuth('/api/notifications')
                ]);
                
                if (statsRes.ok) setStats(await statsRes.json());
                if (notifRes.ok) setNotifications(await notifRes.json());
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        
        loadStats();
    }, [user]);
    
    if (!user) return null;

    if (loading) {
        return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;
    }

    const activities = stats?.recentActivities || [];

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* Top Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    
                    {/* Total Birds Card */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-1 h-full bg-emerald-500"></div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">إجمالي الطيور</p>
                                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats?.totalBirds || 0}</h3>
                            </div>
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-500">
                                <Icons.Bird />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-emerald-500 font-medium flex items-center gap-1">
                                <Icons.TrendingUp className="w-4 h-4" /> +{stats?.birdsAddedThisMonth || 0} هذا الشهر
                            </span>
                        </div>
                    </div>

                    {/* Eggs in Hatchery Card */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-1 h-full bg-amber-400"></div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">البيض في الحضانة</p>
                                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white">{stats?.eggsInHatchery || 0}</h3>
                            </div>
                            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-500">
                                <Icons.Egg />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400">
                                متوقع فقس {stats?.eggsHatchingThisWeek || 0} بيضات هذا الأسبوع
                            </span>
                        </div>
                    </div>

                    {/* Alerts Card */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-1 h-full bg-orange-500"></div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">تنبيهات المخزون</p>
                                <h3 className="text-3xl font-extrabold text-orange-600 dark:text-orange-400">{stats?.alertsCount || 0}</h3>
                            </div>
                            <div className="p-3 bg-orange-50 dark:bg-orange-500/10 rounded-xl text-orange-500">
                                <Icons.AlertTriangle />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <Link href="/dashboard/inventory" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">عرض التفاصيل &larr;</Link>
                        </div>
                    </div>

                </div>

                {/* Productivity Stats (New) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Most Productive */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Icons.TrendingUp className="text-emerald-500 w-5 h-5" />
                            أكثر الطيور إنتاجاً
                        </h2>
                        <div className="space-y-4">
                            {stats?.mostProductive?.length > 0 ? stats.mostProductive.map((item: any, idx: number) => (
                                                                <div key={item.sessionId || idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl border border-gray-100 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0 text-indigo-600 dark:text-indigo-400">
                                            <Icons.Heart className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">ذكر {item.maleIdentifier} &times; أنثى {item.femaleIdentifier}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.cageName}</p>
                                        </div>
                                    </div>
                                    <div className="text-center bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg text-emerald-700 dark:text-emerald-400">
                                        <span className="font-bold text-lg">{item.produced}</span>
                                        <span className="text-xs mr-1">فرخ</span>
                                    </div>
                                </div>
                            )) : <p className="text-sm text-gray-500">لا توجد بيانات إنتاج حتى الآن</p>}
                        </div>
                    </div>

                    {/* Least Productive */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Icons.TrendingDown className="text-red-500 w-5 h-5" />
                            أقل الطيور إنتاجاً
                        </h2>
                        <div className="space-y-4">
                            {stats?.leastProductive?.length > 0 ? stats.leastProductive.map((item: any, idx: number) => (
                                <div key={item.sessionId || idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/30 rounded-xl border border-gray-100 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 text-slate-500 dark:text-slate-400">
                                            <Icons.Heart className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">ذكر {item.maleIdentifier} &times; أنثى {item.femaleIdentifier}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{item.cageName}</p>
                                        </div>
                                    </div>
                                    <div className="text-center bg-red-100 dark:bg-red-900/30 px-3 py-1.5 rounded-lg text-red-700 dark:text-red-400">
                                        <span className="font-bold text-lg">{item.produced}</span>
                                        <span className="text-xs mr-1">فرخ</span>
                                    </div>
                                </div>
                            )) : <p className="text-sm text-gray-500">لا توجد بيانات إنتاج حتى الآن</p>}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}









