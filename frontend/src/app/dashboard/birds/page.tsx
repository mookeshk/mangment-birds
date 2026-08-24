"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import BirdModal from "./BirdModal";
import ConfirmModal from "../../../components/ConfirmModal";

const Icons = {
    Bird: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Search: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Filter: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>,
    Edit: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
    Trash: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
};

export default function BirdsPage() {
    const { fetchWithAuth } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('جميع الأنواع');
    const [birds, setBirds] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [birdToEdit, setBirdToEdit] = useState<any>(null);

    const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, id: number | null}>({ isOpen: false, id: null });

    useEffect(() => {
        loadBirds();
    }, []);

    const loadBirds = async () => {
        try {
            const res = await fetchWithAuth('/api/birds');
            if (res.ok) {
                setBirds(await res.json());
            }
        } finally {
            setIsLoading(false);
        }
    };

    const confirmDelete = (id: number) => {
        setDeleteModal({ isOpen: true, id });
    };

    const executeDelete = async () => {
        if (!deleteModal.id) return;
        const res = await fetchWithAuth(`/api/birds/${deleteModal.id}`, { method: 'DELETE' });
        if (res.ok) {
            loadBirds();
        }
        setDeleteModal({ isOpen: false, id: null });
    };

    const handleEdit = (bird: any) => {
        setBirdToEdit(bird);
        setIsAddModalOpen(true);
    };

    const closeAndClearModal = () => {
        setIsAddModalOpen(false);
        setTimeout(() => setBirdToEdit(null), 300);
    };

    // Filter Logic
    const filteredBirds = useMemo(() => {
        return birds.filter(bird => {
            const matchesSearch = bird.identifier?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  bird.speciesName?.includes(searchQuery) ||
                                  bird.breedName?.includes(searchQuery);
            const matchesType = filterType === 'جميع الأنواع' || bird.speciesName === filterType;
            return matchesSearch && matchesType;
        });
    }, [birds, searchQuery, filterType]);

    const getStatusBadge = (status: number) => {
        switch(status) {
            case 0: return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">نمو</span>;
            case 1: return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">منتج</span>;
            case 2: return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">تزاوج</span>;
            case 3: return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/30">عزل طبي</span>;
            default: return <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400">غير معروف</span>;
        }
    };

    const calculateAge = (hatchDate: string) => {
        if (!hatchDate) return null;
        const start = new Date(hatchDate);
        const end = new Date();
        
        let months = (end.getFullYear() - start.getFullYear()) * 12;
        months -= start.getMonth();
        months += end.getMonth();
        
        if (months <= 0) {
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays + ' أيام';
        }
        if (months === 1) return 'شهر واحد';
        if (months === 2) return 'شهران';
        if (months < 12) return months + ' أشهر';
        
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        
        let ageStr = years === 1 ? 'سنة' : years === 2 ? 'سنتان' : years + ' سنوات';
        if (remainingMonths > 0) {
            ageStr += ' و ' + (remainingMonths === 1 ? 'شهر' : remainingMonths === 2 ? 'شهران' : remainingMonths + ' أشهر');
        }
        return ageStr;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Toolbar */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {/* Search Input */}
                        <div className="relative group w-full sm:w-64">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500">
                                <Icons.Search />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pr-10 pl-3 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"
                                placeholder="ابحث برقم الطائر أو النوع..."
                            />
                        </div>

                        {/* Filter Dropdown */}
                        <div className="relative group w-full sm:w-48">
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                <Icons.Filter />
                            </div>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="block w-full pr-10 pl-3 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm appearance-none cursor-pointer"
                            >
                                <option>جميع الأنواع</option>
                                {Array.from(new Set(birds.map(b => b.speciesName).filter(Boolean))).map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Add Button */}
                    <button onClick={() => { setBirdToEdit(null); setIsAddModalOpen(true); }} className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5">
                        <Icons.Plus />
                        إضافة طائر جديد
                    </button>
                </div>

                {/* Data Table Container */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden min-h-[400px] flex flex-col">
                    
                    {filteredBirds.length > 0 ? (
                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-right border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 dark:bg-slate-700/30 border-b border-gray-100 dark:border-slate-700">
                                        <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300 w-12 text-center">م</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300">معرف الطائر</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300">النوع والسلالة</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300">الجنس</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300">العمر</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300">تاريخ التزاوج</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300">الحالة</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300 text-center">الإجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                    {filteredBirds.map((bird, idx) => (
                                        <tr key={bird.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-gray-500 dark:text-gray-400">{idx + 1}</td>
                                              <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    {bird.photoUrl ? (
                                                        <img src={`http://localhost:5089${bird.photoUrl}`} alt="صورة" className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-slate-600" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                            <Icons.Bird />
                                                        </div>
                                                    )}
                                                    <span className="font-mono font-semibold text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-700/50 px-2 py-1 rounded text-sm">{bird.identifier}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <div className="font-bold text-gray-900 dark:text-white">{bird.speciesName || 'غير محدد'}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{bird.breedName || 'غير محدد'}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm flex items-center gap-1 ${bird.isMale === true ? 'text-blue-500' : bird.isMale === false ? 'text-pink-500' : 'text-gray-500'}`}>
                                                    {bird.isMale === true ? '♂ ذكر' : bird.isMale === false ? '♀ أنثى' : '❓ غير محدد'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{calculateAge(bird.hatchDate) || 'غير محدد'}</span>
                                                    {bird.hatchDate && <span className="text-xs text-gray-500">{new Date(bird.hatchDate).toLocaleDateString('ar-EG')}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {bird.status === 2 && bird.pairingDate ? new Date(bird.pairingDate).toLocaleDateString('ar-EG') : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(bird.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => handleEdit(bird)} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg transition-colors" title="تعديل">
                                                        <Icons.Edit />
                                                    </button>
                                                    <button onClick={() => confirmDelete(bird.id)} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-colors" title="حذف">
                                                        <Icons.Trash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-24 h-24 mb-6 rounded-full bg-gray-50 dark:bg-slate-900 border-4 border-gray-100 dark:border-slate-700 flex items-center justify-center text-gray-300 dark:text-gray-600">
                                <Icons.Bird />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">لا توجد طيور مطابقة</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
                                {searchQuery || filterType !== 'جميع الأنواع' 
                                    ? 'لم نعثر على أي طيور تطابق معايير البحث الحالية. جرب مسح الفلاتر.' 
                                    : 'لم تقم بإضافة أي طيور إلى مزرعتك حتى الآن. ابدأ بإضافة طائرك الأول.'}
                            </p>
                            {(searchQuery || filterType !== 'جميع الأنواع') ? (
                                <button 
                                    onClick={() => { setSearchQuery(''); setFilterType('جميع الأنواع'); }}
                                    className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                                >
                                    مسح عوامل التصفية
                                </button>
                            ) : (
                                <button onClick={() => { setBirdToEdit(null); setIsAddModalOpen(true); }} className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 transition-all">
                                    <Icons.Plus /> إضافة الطائر الأول
                                </button>
                            )}
                        </div>
                    )}
                </div>

            </div>
            
            <BirdModal 
                isOpen={isAddModalOpen} 
                onClose={closeAndClearModal} 
                onAdded={() => loadBirds()} 
                birdToEdit={birdToEdit}
            />

            <ConfirmModal 
                isOpen={deleteModal.isOpen}
                title="حذف الطائر"
                message="هل أنت متأكد من حذف هذا الطائر؟ لا يمكن التراجع عن هذا الإجراء."
                onConfirm={executeDelete}
                onCancel={() => setDeleteModal({ isOpen: false, id: null })}
            />
        </div>
    );
}

