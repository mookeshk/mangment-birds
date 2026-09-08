"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Icons } from "../../../components/Icons";

export default function PackagesPage() {
    const { fetchWithAuth } = useAuth();
    const [packages, setPackages] = useState<any[]>([]);
    
    const [newPackageName, setNewPackageName] = useState("");
    const [newPackagePrice, setNewPackagePrice] = useState("");
    const [newPackageDuration, setNewPackageDuration] = useState("");
    const [newPackageFeatures, setNewPackageFeatures] = useState("");
    
    const [isAIPackageLoading, setIsAIPackageLoading] = useState(false);

    useEffect(() => {
        loadPackages();
    }, []);

    const loadPackages = async () => {
        try {
            const res = await fetchWithAuth("/api/admin/packages");
            if (res.ok) setPackages(await res.json());
        } catch (e) { }
    };

    const addPackage = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newPackageName || !newPackagePrice) return;
        try {
            const res = await fetchWithAuth("/api/admin/packages", {
                method: "POST",
                body: JSON.stringify({ 
                    name: newPackageName, 
                    price: parseFloat(newPackagePrice), 
                    durationMonths: parseInt(newPackageDuration) || 1, 
                    features: newPackageFeatures 
                })
            });
            if (res.ok) {
                setNewPackageName(""); setNewPackagePrice(""); setNewPackageDuration(""); setNewPackageFeatures("");
                loadPackages();
            }
        } catch (e) { }
    };

    const deletePackage = async (id: number) => {
        if (!confirm("هل أنت متأكد من حذف هذه الباقة؟")) return;
        try {
            await fetchWithAuth(`/api/admin/packages/${id}`, { method: "DELETE" });
            loadPackages();
        } catch (e) { }
    };

    const handleAIGeneratePackage = async () => {
        setIsAIPackageLoading(true);
        // Mock AI response
        setTimeout(() => {
            setNewPackageName("باقة النخبة (AI)");
            setNewPackagePrice("2500");
            setNewPackageDuration("12");
            setNewPackageFeatures("عدد لا محدود من الطيور، تحليل ذكي للأداء، تنبيهات استباقية، دعم فني VIP");
            setIsAIPackageLoading(false);
        }, 1500);
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Add New Package Form */}
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-[#334155] overflow-hidden">
                <div className="p-5 border-b border-gray-100 dark:border-[#334155] bg-gray-50/50 dark:bg-[#0f172a]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Icons.Packages className="w-5 h-5" /> إضافة باقة جديدة
                    </h2>
                    <button 
                        type="button"
                        onClick={handleAIGeneratePackage}
                        disabled={isAIPackageLoading}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl text-sm hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all disabled:opacity-50 shadow-sm border border-indigo-100 dark:border-indigo-500/20"
                    >
                        {isAIPackageLoading ? (
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : (
                            <Icons.Sparkles className="w-4 h-4" />
                        )}
                        اقتراح باقة (الذكاء الاصطناعي)
                    </button>
                </div>
                <form onSubmit={addPackage} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">اسم الباقة</label>
                            <input 
                                type="text" 
                                required
                                value={newPackageName}
                                onChange={e => setNewPackageName(e.target.value)}
                                placeholder="مثال: بريميوم برو" 
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">السعر (ج.م)</label>
                            <input 
                                type="number" 
                                required
                                value={newPackagePrice}
                                onChange={e => setNewPackagePrice(e.target.value)}
                                placeholder="مثال: 1500" 
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">المدة (بالشهور)</label>
                            <input 
                                type="number" 
                                required
                                value={newPackageDuration}
                                onChange={e => setNewPackageDuration(e.target.value)}
                                placeholder="مثال: 6" 
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">المميزات (مفصولة بفاصلة)</label>
                            <input 
                                type="text" 
                                value={newPackageFeatures}
                                onChange={e => setNewPackageFeatures(e.target.value)}
                                placeholder="دعم فني، تقارير، عدد لامحدود..." 
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0f172a] border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 flex items-center justify-center gap-2">
                        <Icons.Plus className="w-5 h-5" />
                        إضافة الباقة
                    </button>
                </form>
            </div>

            {/* Packages Grid */}
            <div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">الباقات الحالية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {packages.map(pkg => (
                        <div key={pkg.id} className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-[#334155] p-6 relative flex flex-col group hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all hover:-translate-y-1">
                            {/* Delete Button */}
                            <button 
                                onClick={() => deletePackage(pkg.id)}
                                className="absolute top-4 left-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="حذف الباقة"
                            >
                                <Icons.Ban className="w-5 h-5" />
                            </button>
                            
                            <div className="text-center mb-6 pt-4">
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{pkg.name}</h4>
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">{pkg.price}</span>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">ج.م / {pkg.durationMonths} شهر</span>
                                </div>
                            </div>
                            
                            <div className="flex-1 bg-gray-50 dark:bg-[#0f172a]/50 rounded-xl p-4 border border-gray-100 dark:border-[#334155]/50">
                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 text-center">المميزات</p>
                                <ul className="space-y-3">
                                    {pkg.features && pkg.features.split('،').map((feature: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            {feature.trim()}
                                        </li>
                                    ))}
                                    {pkg.features && pkg.features.includes(',') && !pkg.features.includes('،') && pkg.features.split(',').map((feature: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            {feature.trim()}
                                        </li>
                                    ))}
                                    {!pkg.features && (
                                        <li className="text-sm text-gray-400 text-center italic">لا توجد مميزات مسجلة</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
