"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Icons } from '@/components/Icons';

export default function AdminPackages() {
    const { fetchWithAuth, user } = useAuth();
    const [packages, setPackages] = useState<any[]>([]);
    
    // Add State
    const [newPackageName, setNewPackageName] = useState('');
    const [newPackagePrice, setNewPackagePrice] = useState('');
    const [newPackageDuration, setNewPackageDuration] = useState('');
    const [newPackageFeatures, setNewPackageFeatures] = useState('');

    // Edit State
    const [editId, setEditId] = useState<number | null>(null);
    const [editPackageName, setEditPackageName] = useState('');
    const [editPackagePrice, setEditPackagePrice] = useState('');
    const [editPackageDuration, setEditPackageDuration] = useState('');
    const [editPackageFeatures, setEditPackageFeatures] = useState('');

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const res = await fetchWithAuth('/api/admin/packages');
            if (res.ok) {
                const data = await res.json();
                setPackages(data);
            }
        } catch (err) {
            console.error('error', err);
        }
    };

    const addPackage = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetchWithAuth('/api/admin/packages', {
                method: 'POST',
                body: JSON.stringify({
                    name: newPackageName,
                    price: parseFloat(newPackagePrice),
                    durationMonths: parseInt(newPackageDuration),
                    features: newPackageFeatures
                })
            });
            if (res.ok) {
                alert('تم إضافة الباقة بنجاح');
                setNewPackageName('');
                setNewPackagePrice('');
                setNewPackageDuration('');
                setNewPackageFeatures('');
                fetchPackages();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const deletePackage = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذه الباقة؟')) return;
        try {
            const res = await fetchWithAuth(`/api/admin/packages/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                alert('تم حذف الباقة');
                fetchPackages();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const startEdit = (pkg: any) => {
        setEditId(pkg.id);
        setEditPackageName(pkg.name);
        setEditPackagePrice(pkg.price);
        setEditPackageDuration(pkg.durationMonths);
        setEditPackageFeatures(pkg.features || '');
    };

    const cancelEdit = () => {
        setEditId(null);
    };

    const saveEdit = async () => {
        if (!editId) return;
        try {
            const res = await fetchWithAuth(`/api/admin/packages/${editId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    id: editId,
                    name: editPackageName,
                    price: parseFloat(editPackagePrice as any),
                    durationMonths: parseInt(editPackageDuration as any),
                    features: editPackageFeatures
                })
            });
            if (res.ok) {
                alert('تم تحديث الباقة بنجاح');
                setEditId(null);
                fetchPackages();
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (user?.role !== 'Admin') return <div className="p-8 text-center text-red-500">غير مصرح لك بالدخول</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-8" dir="rtl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#1e293b] p-6 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        إدارة باقات الاشتراك
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">أضف وعدل باقات الاشتراك المتاحة للمستخدمين</p>
                </div>
            </div>

            {/* Add New Package */}
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">إضافة باقة جديدة</h3>
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
                            {editId === pkg.id ? (
                                // Edit Mode
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">اسم الباقة</label>
                                        <input type="text" value={editPackageName} onChange={e => setEditPackageName(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white" />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-gray-500 mb-1">السعر</label>
                                            <input type="number" value={editPackagePrice} onChange={e => setEditPackagePrice(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold text-gray-500 mb-1">المدة (شهور)</label>
                                            <input type="number" value={editPackageDuration} onChange={e => setEditPackageDuration(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">المميزات (مفصولة بفاصلة)</label>
                                        <input type="text" value={editPackageFeatures} onChange={e => setEditPackageFeatures(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm dark:text-white" />
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button onClick={saveEdit} className="flex-1 bg-emerald-500 text-white py-2 rounded-lg font-bold hover:bg-emerald-600">حفظ</button>
                                        <button onClick={cancelEdit} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600">إلغاء</button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <>
                                    <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button 
                                            onClick={() => startEdit(pkg)}
                                            className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                                            title="تعديل الباقة"
                                        >
                                            <Icons.Edit className="w-5 h-5" />
                                        </button>
                                        <button 
                                            onClick={() => deletePackage(pkg.id)}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="حذف الباقة"
                                        >
                                            <Icons.Ban className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
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
                                </>
                            )}
                        </div>
                    ))}
                    {packages.length === 0 && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl">
                            <p className="text-gray-500 dark:text-gray-400 font-bold">لا توجد باقات مضافة حتى الآن</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
