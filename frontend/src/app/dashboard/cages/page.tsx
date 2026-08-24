"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import ConfirmModal from "../../../components/ConfirmModal";

const Icons = {
    Grid: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Edit: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Trash: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
};

export default function CagesPage() {
    const { fetchWithAuth } = useAuth();
    const [cages, setCages] = useState<any[]>([]);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editCageId, setEditCageId] = useState<number | null>(null);
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState("");

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        action: async () => {}
    });

    useEffect(() => {
        loadCages();
    }, []);

    const loadCages = async () => {
        try {
            const res = await fetchWithAuth('/api/cages');
            if (res.ok) setCages(await res.json());
        } catch (error) {
            console.error(error);
        }
    };

    const openCreate = () => {
        setEditCageId(null);
        setName("");
        setCapacity("");
        setIsModalOpen(true);
    };

    const openEdit = (cage: any) => {
        setEditCageId(cage.id);
        setName(cage.name);
        setCapacity(cage.capacity.toString());
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            id: editCageId || 0,
            name,
            capacity: parseInt(capacity) || 0,
            qrCode: ""
        };

        const res = await fetchWithAuth(`/api/cages${editCageId ? `/${editCageId}` : ''}`, {
            method: editCageId ? 'PUT' : 'POST',
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            setIsModalOpen(false);
            loadCages();
        } else {
            setConfirmModal({
                isOpen: true,
                title: "خطأ",
                message: "حدث خطأ أثناء حفظ القفص. تأكد من إدخال البيانات بشكل صحيح.",
                action: async () => { setConfirmModal(prev => ({ ...prev, isOpen: false })); }
            });
        }
    };

    const confirmDelete = (id: number) => {
        setConfirmModal({
            isOpen: true,
            title: "حذف القفص/المطيار",
            message: "هل أنت متأكد من حذف هذا القفص أو المطيار؟ (تأكد من عدم وجود طيور به أولاً)",
            action: async () => {
                const res = await fetchWithAuth(`/api/cages/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    loadCages();
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                } else {
                    setConfirmModal({
                        isOpen: true,
                        title: "خطأ",
                        message: "لا يمكن الحذف، ربما هناك طيور مسجلة في هذا القفص.",
                        action: async () => { setConfirmModal(prev => ({ ...prev, isOpen: false })); }
                    });
                }
            }
        });
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                            <Icons.Grid /> إدارة المطاير والأقفاص
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">قم بتسجيل أقفاصك وسلاكاتك لاستخدامها في التزاوج الجماعي ومتابعة التسكين.</p>
                    </div>
                    <button 
                        onClick={openCreate}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                    >
                        <Icons.Plus />
                        إضافة قفص / مطيار جديد
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cages.length > 0 ? (
                        cages.map(cage => (
                            <div key={cage.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 p-5 group hover:border-emerald-400 hover:shadow-lg dark:hover:border-emerald-500 transition-all hover:-translate-y-1 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors"></div>
                                <div className="flex justify-between items-start mb-4 pr-3">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 flex items-center justify-center">
                                        <Icons.Grid />
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(cage)} className="p-1.5 text-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-md hover:bg-blue-100">
                                            <Icons.Edit />
                                        </button>
                                        <button onClick={() => confirmDelete(cage.id)} className="p-1.5 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100">
                                            <Icons.Trash />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 pr-3">{cage.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 pr-3">سعة القفص: {cage.capacity} طائر</p>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                <Icons.Grid />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">لا توجد أقفاص مسجلة</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">قم بإضافة الأقفاص والمطاير لتتمكن من استخدامها في النظام.</p>
                        </div>
                    )}
                </div>

            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                            {editCageId ? "تعديل قفص" : "إضافة قفص جديد"}
                        </h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">اسم/رقم القفص (أو المطيار)</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="مثال: مطيار 1، أو قفص تزاوج 5"
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">سعة القفص (عدد الطيور)</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={capacity}
                                    onChange={e => setCapacity(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-sm">
                                    حفظ القفص
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600 py-2.5 rounded-xl font-bold text-sm">
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmModal 
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.action}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
            />
        </div>
    );
}
