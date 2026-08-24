"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Icons } from '@/components/Icons';

export default function FarmSettingsTab() {
    const { user, fetchWithAuth, refreshUser } = useAuth();
    
    const [farmName, setFarmName] = useState(user?.farmName || '');
    const [contactNumbers, setContactNumbers] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(user?.farmLogoUrl || null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setFarmName(user.farmName || '');
            setPreviewUrl(user.farmLogoUrl || null);
            fetchFarmSettings();
        }
    }, [user]);

    const fetchFarmSettings = async () => {
        try {
            const res = await fetchWithAuth('/api/FarmSettings');
            if (res.ok) {
                const data = await res.json();
                setContactNumbers(data.contactNumbers || "");
            }
        } catch (e) {}
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        try {
            const formData = new FormData();
            formData.append('farmName', farmName);
            formData.append('contactNumbers', contactNumbers);
            
            const file = fileInputRef.current?.files?.[0];
            if (file) {
                formData.append('logo', file);
            }

            const res = await fetchWithAuth('/api/FarmSettings', {
                method: 'PUT',
                body: formData,
            });

            if (res.ok) {
                setMessage({ text: 'تم حفظ الإعدادات بنجاح', type: 'success' });
                await refreshUser();
            } else {
                setMessage({ text: 'فشل في حفظ الإعدادات', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'حدث خطأ في الاتصال بالخادم', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-8 max-w-xl mx-auto shadow-sm border border-gray-100 dark:border-[#334155] transition-all duration-300 animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">إعدادات المزرعة</h3>
            
            {message.text && (
                <div className={`p-4 rounded-xl mb-6 text-center text-sm font-bold shadow-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {message.text}
                </div>
            )}

            {/* Logo Upload Area */}
            <div className="flex flex-col items-center justify-center mb-8">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-28 h-28 rounded-full border-4 border-white dark:border-[#1e293b] shadow-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative">
                        {previewUrl ? (
                            <img src={previewUrl.startsWith('blob:') ? previewUrl : previewUrl} alt="Farm Logo" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl font-bold text-gray-400 dark:text-gray-600 select-none">
                                {farmName ? farmName.charAt(0) : 'م'}
                            </span>
                        )}
                    </div>
                    <div className="absolute bottom-1 right-1 bg-emerald-500 rounded-full p-2 border-2 border-white dark:border-[#1e293b] shadow-sm group-hover:scale-110 transition-transform">
                        <Icons.Camera />
                    </div>
                    <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center px-4">
                    اختر صورة لشعار المزرعة (يفضل أن تكون مربعة)
                </p>
            </div>

            {/* Form Fields */}
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 px-1">اسم المزرعة</label>
                    <input 
                        type="text" 
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0f172a] border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 px-1">أرقام التواصل</label>
                    <input 
                        type="text" 
                        value={contactNumbers}
                        onChange={(e) => setContactNumbers(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0f172a] border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                        dir="ltr"
                    />
                </div>
                <div className="pt-4">
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 focus:outline-none"
                    >
                        {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                </div>
            </form>
        </div>
    );
}
