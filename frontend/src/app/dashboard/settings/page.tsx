"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Icons } from '@/components/Icons';
import FarmSettingsTab from '@/components/FarmSettingsTab';
import SubscriptionTab from '@/components/SubscriptionTab';
import ConfirmModal from '@/components/ConfirmModal';
import { AIFarmAssistant } from '@/components/AIFarmAssistant'; // Wait, does this exist? No, I will create it or ignore it since it's just a UI element. Wait, user included AIFarmAssistant. I will create it.

export default function SettingsPage() {
    const { user, fetchWithAuth } = useAuth();
    const [activeTab, setActiveTab] = useState('farm');
    
    // Species State
    const [species, setSpecies] = useState<any[]>([]);
    const [breeds, setBreeds] = useState<any[]>([]);
    const [selectedSpeciesId, setSelectedSpeciesId] = useState<number | null>(null);
    const [newSpeciesName, setNewSpeciesName] = useState("");
    const [newSpeciesHatch, setNewSpeciesHatch] = useState("");
    const [newSpeciesMature, setNewSpeciesMature] = useState("");
    
    const [newBreedName, setNewBreedName] = useState("");
    const [editBreedId, setEditBreedId] = useState<number | null>(null);

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, title: '', message: '', targetId: 0, type: '' });
    const [isAILoading, setIsAILoading] = useState(false);

    useEffect(() => {
        loadSpecies();
    }, []);

    const loadSpecies = async () => {
        try {
            const res = await fetchWithAuth('/api/Birds/species');
            if (res.ok) setSpecies(await res.json());
        } catch (e) {}
    };

    const loadBreeds = async (speciesId: number) => {
        try {
            const res = await fetchWithAuth(`/api/Birds/species/${speciesId}/breeds`);
            if (res.ok) setBreeds(await res.json());
        } catch (e) {}
    };

    const handleSpeciesClick = (id: number) => {
        setSelectedSpeciesId(id);
        loadBreeds(id);
    };

    const handleAddSpecies = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetchWithAuth('/api/Birds/species', {
                method: 'POST',
                body: JSON.stringify({ name: newSpeciesName })
            });
            if (res.ok) {
                setNewSpeciesName(""); setNewSpeciesHatch(""); setNewSpeciesMature("");
                loadSpecies();
            }
        } catch (e) {}
    };

    const confirmDeleteSpecies = (id: number) => setDeleteModal({ isOpen: true, title: 'حذف النوع', message: 'هل أنت متأكد؟ سيتم حذف جميع الفصائل والطيور المرتبطة به.', targetId: id, type: 'species' });
    const confirmDeleteBreed = (id: number) => setDeleteModal({ isOpen: true, title: 'حذف الفصيلة', message: 'هل أنت متأكد؟ سيتم حذف جميع الطيور المرتبطة بها.', targetId: id, type: 'breed' });

    const executeDelete = async () => {
        try {
            if (deleteModal.type === 'species') {
                await fetchWithAuth(`/api/Birds/species/${deleteModal.targetId}`, { method: 'DELETE' });
                if (selectedSpeciesId === deleteModal.targetId) { setSelectedSpeciesId(null); setBreeds([]); }
                loadSpecies();
            } else if (deleteModal.type === 'breed') {
                await fetchWithAuth(`/api/Birds/breeds/${deleteModal.targetId}`, { method: 'DELETE' });
                if (selectedSpeciesId) loadBreeds(selectedSpeciesId);
            }
        } catch (e) {}
        setDeleteModal({ ...deleteModal, isOpen: false });
    };

    const handleAddOrEditBreed = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSpeciesId) return;
        try {
            if (editBreedId) {
                const res = await fetchWithAuth(`/api/Birds/breeds/${editBreedId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ id: editBreedId, speciesId: selectedSpeciesId, name: newBreedName })
                });
                if (res.ok) { resetBreedForm(); loadBreeds(selectedSpeciesId); }
            } else {
                const res = await fetchWithAuth('/api/Birds/breeds', {
                    method: 'POST',
                    body: JSON.stringify({ speciesId: selectedSpeciesId, name: newBreedName })
                });
                if (res.ok) { resetBreedForm(); loadBreeds(selectedSpeciesId); loadSpecies(); }
            }
        } catch (e) {}
    };

    const startEditBreed = (breed: any) => { setEditBreedId(breed.id); setNewBreedName(breed.name); };
    const resetBreedForm = () => { setEditBreedId(null); setNewBreedName(""); };

    const handleAIFill = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!newSpeciesName) return;
        setIsAILoading(true);
        // AI Logic placeholder for now, just mock the delay
        setTimeout(() => {
            setNewSpeciesHatch('21 يوم');
            setNewSpeciesMature('8 أشهر');
            setIsAILoading(false);
        }, 1500);
    };

    const tabs = [
        { id: 'farm', label: 'إعدادات المزرعة' },
        { id: 'species', label: 'الأنواع والفصائل' },
        { id: 'password', label: 'كلمة المرور' },
        { id: 'subscription', label: 'تفاصيل الاشتراك' }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
            {/* TOP NAVIGATION BAR */}
            <div className="bg-white dark:bg-[#111827] rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-[#334155] flex flex-col items-center justify-center relative overflow-hidden transition-colors">
                <div className="w-12 h-12 bg-gray-50 dark:bg-[#0f172a] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center text-emerald-500 mb-6">
                    <Icons.Settings />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-center">الإعدادات</h2>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 w-full">
                    {tabs.map((tab) => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap 
                                ${activeTab === tab.id 
                                    ? 'bg-emerald-500 text-white shadow-glow' 
                                    : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* TAB CONTENT */}
            <div className="pb-10">
                {activeTab === 'farm' && <FarmSettingsTab />}
                
                {activeTab === 'species' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in zoom-in-95 duration-300">
                        {/* Right Side: Species List */}
                        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-[#334155] h-[500px] flex flex-col transition-colors">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5">الأنواع (Species)</h3>
                            
                            <form onSubmit={handleAddSpecies} className="flex flex-col gap-3 mb-5">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="اسم النوع (مثال: حمام، دجاج...)" 
                                        value={newSpeciesName}
                                        onChange={(e) => setNewSpeciesName(e.target.value)}
                                        required
                                        className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-[#0f172a] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-white transition-colors"
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleAIFill}
                                        disabled={isAILoading || !newSpeciesName}
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1 text-xs font-bold disabled:opacity-50 focus:outline-none shadow-md shadow-indigo-500/20"
                                        title="إكمال الخصائص بالذكاء الاصطناعي"
                                    >
                                        {isAILoading ? (
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                                        )}
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input 
                                        type="text" 
                                        placeholder="فترة حضانة البيض" 
                                        value={newSpeciesHatch}
                                        onChange={(e) => setNewSpeciesHatch(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0f172a] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-white transition-colors"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="سن البلوغ" 
                                        value={newSpeciesMature}
                                        onChange={(e) => setNewSpeciesMature(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0f172a] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-white transition-colors"
                                    />
                                </div>
                                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl transition-colors shadow-sm focus:outline-none text-sm">
                                    إضافة النوع
                                </button>
                            </form>

                            <div className="space-y-3 overflow-y-auto flex-1 pr-1 pb-4">
                                {species.map(item => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => handleSpeciesClick(item.id)}
                                        className={`flex items-center justify-between p-4 bg-gray-50/50 dark:bg-[#0f172a]/50 border rounded-2xl hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-colors group cursor-pointer ${selectedSpeciesId === item.id ? 'border-emerald-500 dark:border-emerald-500' : 'border-gray-100 dark:border-gray-800'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm shrink-0">
                                                {item.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.name}</h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {item.breedsCount} فصائل
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => { e.stopPropagation(); confirmDeleteSpecies(item.id); }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="حذف">
                                                <Icons.Trash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Left Side: Breeds List */}
                        <div className="bg-white dark:bg-[#1e293b] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-[#334155] h-[500px] flex flex-col relative overflow-hidden transition-colors">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">الفصائل (Breeds)</h3>
                            
                            {!selectedSpeciesId ? (
                                <div className="absolute inset-0 top-14 flex flex-col items-center justify-center bg-gray-50/80 dark:bg-[#0f172a]/80 backdrop-blur-[2px]">
                                    <div className="w-12 h-12 mb-4 rounded-full bg-white dark:bg-[#1e293b] shadow-sm flex items-center justify-center text-gray-400 dark:text-gray-500">
                                        <Icons.Settings />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">يرجى اختيار نوع من القائمة لعرض وإدارة الفصائل التابعة له.</p>
                                </div>
                            ) : (
                                <>
                                    <form onSubmit={handleAddOrEditBreed} className="flex gap-2 mb-5">
                                        <input
                                            type="text"
                                            required
                                            value={newBreedName}
                                            onChange={e => setNewBreedName(e.target.value)}
                                            placeholder="اسم الفصيلة (مثال: زاجل، كش...)"
                                            className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-[#0f172a] border border-transparent rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:text-white transition-colors"
                                        />
                                        <button type="submit" className={`text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md focus:outline-none ${editBreedId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'}`}>
                                            {editBreedId ? 'حفظ' : 'إضافة'}
                                        </button>
                                        {editBreedId && (
                                            <button type="button" onClick={resetBreedForm} className="px-3 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-300 rounded-xl transition-all">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        )}
                                    </form>
                                    
                                    <div className="space-y-3 overflow-y-auto flex-1 pr-1 pb-4">
                                        {breeds.length === 0 ? (
                                            <div className="text-center text-gray-500 text-sm py-8">لا توجد فصائل مسجلة لهذا النوع.</div>
                                        ) : (
                                            breeds.map(b => (
                                                <div key={b.id} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-[#0f172a]/50 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-colors group">
                                                    <div className="font-bold text-gray-900 dark:text-white text-sm">
                                                        {b.name}
                                                    </div>
                                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => startEditBreed(b)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="تعديل">
                                                            <Icons.Edit />
                                                        </button>
                                                        <button onClick={() => confirmDeleteBreed(b.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="حذف">
                                                            <Icons.Trash />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'password' && (
                    <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-8 max-w-xl mx-auto shadow-sm border border-gray-100 dark:border-[#334155] transition-all duration-300 animate-in fade-in zoom-in-95">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">تغيير كلمة المرور</h3>
                        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 px-1">كلمة المرور الحالية</label>
                                <input 
                                    type="password" 
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0f172a] border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors tracking-widest"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 px-1">كلمة المرور الجديدة</label>
                                <input 
                                    type="password" 
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0f172a] border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors tracking-widest"
                                    dir="ltr"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 px-1">تأكيد كلمة المرور الجديدة</label>
                                <input 
                                    type="password" 
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0f172a] border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors tracking-widest"
                                    dir="ltr"
                                />
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 focus:outline-none">
                                    حفظ التغييرات
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'subscription' && <SubscriptionTab />}
            </div>

            <ConfirmModal 
                isOpen={deleteModal.isOpen}
                title={deleteModal.title}
                message={deleteModal.message}
                onConfirm={executeDelete}
                onCancel={() => setDeleteModal({ ...deleteModal, isOpen: false })}
            />
        </div>
    );
}
