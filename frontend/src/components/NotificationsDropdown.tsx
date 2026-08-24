"use client";
import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function NotificationsDropdown() {
    const { user, fetchWithAuth } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) return;
        
        const fetchNotifications = async () => {
            try {
                const res = await fetchWithAuth('/api/notifications');
                if (res.ok) setNotifications(await res.json());
            } catch (err) {
                console.error("Failed to load notifications", err);
            }
        };
        fetchNotifications();
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
                <Icons.Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            الإشعارات
                            {notifications.length > 0 && (
                                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {notifications.length}
                                </span>
                            )}
                        </h3>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700">
                        {notifications.length > 0 ? notifications.map((notif: any, idx: number) => (
                            <div key={idx} className={`p-4 flex gap-3 ${notif.isCritical ? 'bg-red-50/50 dark:bg-red-900/10' : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>
                                <div className={`p-2 rounded-full h-fit flex-shrink-0 ${notif.type === 'inventory' ? 'bg-orange-100 text-orange-600' : notif.type === 'health' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {notif.type === 'inventory' ? <Icons.AlertTriangle className="w-4 h-4" /> : notif.type === 'health' ? <Icons.Heart className="w-4 h-4" /> : <Icons.Egg className="w-4 h-4" />}
                                </div>
                                <div>
                                    <h4 className={`text-xs font-bold ${notif.isCritical ? 'text-red-700 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{notif.title}</h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{notif.message}</p>
                                    <span className="text-[10px] text-gray-400 mt-1 block">{new Date(notif.date).toLocaleDateString('ar-EG')}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                لا توجد إشعارات حالياً
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

