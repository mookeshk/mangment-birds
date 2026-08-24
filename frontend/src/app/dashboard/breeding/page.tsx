"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import PairingModal from "./PairingModal";
import HatchModal from "./HatchModal";
import AddEggModal from "./AddEggModal";
import ConfirmModal from "../../../components/ConfirmModal";

const Icons = {
    Bird: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
    Egg: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Check: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
    Heart: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    XCircle: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Ban: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>,
    Trash: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    ArrowLeft: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
};

export default function BreedingPage() {
    const { fetchWithAuth } = useAuth();
    
    const [breedingPairs, setBreedingPairs] = useState<any[]>([]);
    const [incubatorEggs, setIncubatorEggs] = useState<any[]>([]);
    const [allBirds, setAllBirds] = useState<any[]>([]);
    const [cages, setCages] = useState<any[]>([]);
    
    const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);
    const [eggModalSession, setEggModalSession] = useState<any>(null);
    const [selectedPairId, setSelectedPairId] = useState<number | null>(null);
    const [activeEggTab, setActiveEggTab] = useState<number>(0); 

    const [hatchModalState, setHatchModalState] = useState<{isOpen: boolean; eggId: number | null; session: any | null}>({isOpen: false, eggId: null, session: null});

    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        action: () => Promise<void>;
    }>({
        isOpen: false,
        title: '',
        message: '',
        action: async () => {}
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [sessionsRes, birdsRes, cagesRes, eggsRes] = await Promise.all([
                fetchWithAuth('/api/breedingsessions'),
                fetchWithAuth('/api/birds'),
                fetchWithAuth('/api/cages'),
                fetchWithAuth('/api/eggs')
            ]);
            
            if (sessionsRes.ok) {
                const pairs = await sessionsRes.json();
                setBreedingPairs(pairs);
                if (pairs.length > 0 && selectedPairId === null) {
                    setSelectedPairId(pairs[0].id);
                } else if (pairs.length === 0) {
                    setSelectedPairId(null);
                }
            }

            if (birdsRes.ok) setAllBirds(await birdsRes.json());
            if (cagesRes.ok) setCages(await cagesRes.json());
            if (eggsRes.ok) setIncubatorEggs(await eggsRes.json());
            
        } catch (error) {
            console.error(error);
        }
    };

    const handleSavePairing = async (data: any) => {
        const res = await fetchWithAuth('/api/breedingsessions', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (res.ok) {
            loadData();
        } else {
            const err = await res.text();
            alert(err || "حدث خطأ أثناء الحفظ");
        }
    };

    const handleSaveEgg = async (data: any) => {
        const res = await fetchWithAuth('/api/eggs', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (res.ok) {
            loadData();
            setActiveEggTab(0);
            setEggModalSession(null);
        } else {
            const err = await res.text();
            alert(err || "حدث خطأ أثناء حفظ البيضة");
        }
    };

    const executeUpdateEggStatus = async (id: number, newStatus: number) => {
        const res = await fetchWithAuth(`/api/eggs/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status: newStatus })
        });
        
        if (res.ok) {
            loadData();
        } else {
            alert("حدث خطأ أثناء التحديث");
        }
    };

    const handleUpdateEggStatus = (id: number, newStatus: number, session: any = null) => {
        if (newStatus === 1) {
            setHatchModalState({ isOpen: true, eggId: id, session: session });
            return;
        }

        const statusText = newStatus === 2 ? "تالف/كبس" : "غير مخصب";

        setConfirmState({
            isOpen: true,
            title: "تأكيد التحديث",
            message: `هل أنت متأكد من تغيير حالة هذه البيضة إلى '${statusText}'؟`,
            action: async () => {
                await executeUpdateEggStatus(id, newStatus);
                setConfirmState(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const executeDeleteEgg = async (id: number) => {
        const res = await fetchWithAuth(`/api/eggs/${id}`, {
            method: 'DELETE'
        });
        
        if (res.ok) {
            loadData();
        } else {
            alert("حدث خطأ أثناء الحذف");
        }
    };

    const handleDeleteEgg = (id: number) => {
        setConfirmState({
            isOpen: true,
            title: "حذف البيضة",
            message: "هل أنت متأكد من حذف هذه البيضة؟ لا يمكن التراجع عن هذا الإجراء.",
            action: async () => {
                await executeDeleteEgg(id);
                setConfirmState(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleDeleteSession = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmState({
            isOpen: true,
            title: "إلغاء التزاوج",
            message: "هل أنت متأكد من إلغاء هذا التزاوج؟ سيتم حذف الدورة وجميع البيض المرتبط بها، وستعود حالة الطيور إلى 'متاح'.",
            action: async () => {
                const res = await fetchWithAuth(`/api/breedingsessions/${id}`, {
                    method: 'DELETE'
                });
                
                if (res.ok) {
                    if (selectedPairId === id) setSelectedPairId(null);
                    loadData();
                } else {
                    alert("حدث خطأ أثناء الحذف");
                }
                setConfirmState(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const selectedPair = breedingPairs.find(p => p.id === selectedPairId);
    
    const filteredEggs = incubatorEggs.filter(e => 
        e.breedingSessionId === selectedPairId && 
        e.status === activeEggTab
    );

    const eggCountsByStatus = {
        0: incubatorEggs.filter(e => e.breedingSessionId === selectedPairId && e.status === 0).length,
        1: incubatorEggs.filter(e => e.breedingSessionId === selectedPairId && e.status === 1).length,
        2: incubatorEggs.filter(e => e.breedingSessionId === selectedPairId && e.status === 2).length,
        3: incubatorEggs.filter(e => e.breedingSessionId === selectedPairId && e.status === 3).length,
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">نظام التزاوج والتفريخ</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">تتبع أزواج الطيور، دورات التحضين، ومواعيد الفقس المتوقعة.</p>
                    </div>
                    <button 
                        onClick={() => setIsPairingModalOpen(true)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                    >
                        <Icons.Plus />
                        تسجيل تزاوج جديد
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col min-h-[400px]">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Icons.Heart /> أزواج الطيور
                            </h3>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            {breedingPairs.length > 0 ? (
                                <div className="space-y-3">
                                    {breedingPairs.map(pair => {
                                        const isSelected = pair.id === selectedPairId;
                                        return (
                                            <div 
                                                key={pair.id} 
                                                onClick={() => setSelectedPairId(pair.id)}
                                                className={`cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border transition-all gap-4 group ${
                                                    isSelected 
                                                    ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/10' 
                                                    : 'border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-800/50'
                                                }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${
                                                        isSelected 
                                                        ? 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-500/30' 
                                                        : 'bg-indigo-50 text-indigo-500 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20'
                                                    }`}>
                                                        <Icons.Bird />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white text-base">
                                                        {pair.maleIdentifier ? (
                                            <>
                                                {pair.maleIdentifier} <span className="text-gray-400 dark:text-slate-500 mx-1">×</span> {pair.femaleIdentifier}
                                            </>
                                        ) : (
                                            <>
                                                {pair.cageName}
                                            </>
                                        )}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                                                            {pair.speciesName} 
                                                            {pair.cageName && pair.maleIdentifier && <span className="mx-1 text-emerald-600 dark:text-emerald-400">• قفص: {pair.cageName}</span>}
                                                            <span className="mx-1">•</span> تم: {new Date(pair.matingDate).toLocaleDateString('ar-EG')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="w-full sm:w-auto flex justify-end gap-2 items-center">
                                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${
                                                        pair.isActive
                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30' 
                                                        : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/30'
                                                    }`}>
                                                        {pair.isActive ? (
                                                            <>
                                                                <Icons.Check /> جاري التحضين ({pair.activeEggsCount} بيضة)
                                                            </>
                                                        ) : "منتهي"}
                                                    </span>
                                                    <button 
                                                        onClick={(e) => handleDeleteSession(pair.id, e)}
                                                        className={`p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-all opacity-0 group-hover:opacity-100 ${isSelected ? 'opacity-100' : ''}`}
                                                        title="إلغاء هذا التزاوج"
                                                    >
                                                        <Icons.Trash />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-8 text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-900 flex items-center justify-center border border-gray-100 dark:border-slate-700">
                                        <Icons.Heart />
                                    </div>
                                    <p className="text-sm">لا توجد أزواج مسجلة حالياً.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col min-h-[400px]">
                        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Icons.Egg /> سجل البيض 
                            </h3>
                            {selectedPair && selectedPair.isActive && (
                                <button 
                                    onClick={() => setEggModalSession(selectedPair)}
                                    className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors"
                                >
                                    <Icons.Plus /> إضافة بيضة
                                </button>
                            )}
                        </div>
                        
                        {selectedPair && (
                            <div className="flex items-center gap-2 p-3 border-b border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-x-auto">
                                <button 
                                    onClick={() => setActiveEggTab(0)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeEggTab === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700'}`}
                                >
                                    قيد التحضين ({eggCountsByStatus[0] || 0})
                                </button>
                                <button 
                                    onClick={() => setActiveEggTab(1)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeEggTab === 1 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700'}`}
                                >
                                    تم الفقس ({eggCountsByStatus[1] || 0})
                                </button>
                                <button 
                                    onClick={() => setActiveEggTab(3)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeEggTab === 3 ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700'}`}
                                >
                                    غير مخصب ({eggCountsByStatus[3] || 0})
                                </button>
                                <button 
                                    onClick={() => setActiveEggTab(2)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${activeEggTab === 2 ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700'}`}
                                >
                                    تالف ({eggCountsByStatus[2] || 0})
                                </button>
                            </div>
                        )}

                        <div className="overflow-x-auto flex-1 flex flex-col">
                            {!selectedPair ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-8 text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-900 flex items-center justify-center border border-gray-100 dark:border-slate-700">
                                        <Icons.ArrowLeft />
                                    </div>
                                    <p className="text-sm">الرجاء اختيار زوج من القائمة لعرض البيض الخاص به.</p>
                                </div>
                            ) : filteredEggs.length > 0 ? (
                                <table className="w-full text-right border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                                            <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">الوضع</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">الفقس المتوقع</th>
                                            <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">الإجراء / الحالة</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                                        {filteredEggs.map((egg) => {
                                            const today = new Date();
                                            const hatchDate = new Date(egg.expectedHatchDate);
                                            const diffTime = hatchDate.getTime() - today.getTime();
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                            return (
                                            <tr key={egg.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/80 transition-colors">
                                                <td className="px-4 py-4 whitespace-nowrap text-xs font-medium text-gray-600 dark:text-gray-300">
                                                    {new Date(egg.laidDate).toLocaleDateString('ar-EG')}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                            {new Date(egg.expectedHatchDate).toLocaleDateString('ar-EG')}
                                                        </span>
                                                        {egg.status === 0 && (
                                                            <span className={`text-[10px] font-bold mt-0.5 ${diffDays <= 3 ? 'text-red-500 dark:text-red-400 animate-pulse' : 'text-amber-500 dark:text-amber-400'}`}>
                                                                (باقي {diffDays > 0 ? diffDays : 0} أيام)
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap flex items-center justify-center gap-2">
                                                    {egg.status === 0 ? (
                                                        <div className="flex items-center justify-center gap-1.5">
                                                            <button 
                                                                onClick={() => handleUpdateEggStatus(egg.id, 1, selectedPair)}
                                                                title="تسجيل فقس"
                                                                className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                                                            >
                                                                <Icons.Check />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleUpdateEggStatus(egg.id, 3, selectedPair)}
                                                                title="غير مخصب"
                                                                className="p-1.5 text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                                                            >
                                                                <Icons.Ban />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleUpdateEggStatus(egg.id, 2, selectedPair)}
                                                                title="تالف / كبس"
                                                                className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                                            >
                                                                <Icons.XCircle />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            {egg.status === 1 && <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold">تم الفقس بنجاح</span>}
                                                            {egg.status === 2 && <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold">تالف</span>}
                                                            {egg.status === 3 && <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold">غير مخصب</span>}
                                                        </div>
                                                    )}
                                                    
                                                    <button 
                                                        onClick={() => handleDeleteEgg(egg.id)}
                                                        title="حذف البيضة"
                                                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors ml-2"
                                                    >
                                                        <Icons.Trash />
                                                    </button>
                                                </td>
                                            </tr>
                                        )})}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 p-8 text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-slate-900 flex items-center justify-center border border-gray-100 dark:border-slate-700">
                                        <Icons.Egg />
                                    </div>
                                    <p className="text-sm">لا توجد بيض في هذا السجل حالياً.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            <PairingModal 
                isOpen={isPairingModalOpen} 
                onClose={() => setIsPairingModalOpen(false)} 
                onSave={handleSavePairing}
                birds={allBirds}
                cages={cages}
            />

            <AddEggModal 
                isOpen={!!eggModalSession}
                onClose={() => setEggModalSession(null)}
                onSave={handleSaveEgg}
                session={eggModalSession}
            />

            <HatchModal 
                isOpen={hatchModalState.isOpen}
                eggId={hatchModalState.eggId}
                session={hatchModalState.session}
                onClose={() => setHatchModalState({ isOpen: false, eggId: null, session: null })}
                onSuccess={() => {
                    loadData();
                    setEggModalSession(null);
                }}
            />

            <ConfirmModal 
                isOpen={confirmState.isOpen}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={confirmState.action}
                onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}



