"use client";
import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

export default function HealthModal({ isOpen, onClose, onSave, inventoryItems, birds, cages }: any) {
    const { fetchWithAuth } = useAuth();
    
    const [title, setTitle] = useState("");
    const [dateGiven, setDateGiven] = useState("");
    const [nextDueDate, setNextDueDate] = useState("");
    const [notes, setNotes] = useState("");
    
    const [targetType, setTargetType] = useState("0");
    const [targetBirdId, setTargetBirdId] = useState("");
    const [targetCageId, setTargetCageId] = useState("");
    
    const [inventoryItemId, setInventoryItemId] = useState("");
    const [quantityUsed, setQuantityUsed] = useState("");

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTitle("");
            setDateGiven(new Date().toISOString().split('T')[0]);
            setNextDueDate("");
            setNotes("");
            setTargetType("0");
            setTargetBirdId("");
            setTargetCageId("");
            setInventoryItemId("");
            setQuantityUsed("");
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        try {
            const payload = {
                title,
                dateGiven: new Date(dateGiven).toISOString(),
                nextDueDate: nextDueDate ? new Date(nextDueDate).toISOString() : null,
                notes,
                targetType: parseInt(targetType),
                targetBirdId: targetType === "0" && targetBirdId ? parseInt(targetBirdId) : null,
                targetCageId: targetType === "1" && targetCageId ? parseInt(targetCageId) : null,
                inventoryItemId: inventoryItemId ? parseInt(inventoryItemId) : null,
                quantityUsed: inventoryItemId && quantityUsed ? parseFloat(quantityUsed) : null
            };

            const res = await fetchWithAuth('/api/health', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSave();
                onClose();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-auto mt-10 mb-10">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Icons.Syringe className="w-5 h-5 text-rose-500" />
                        تسجيل جرعة / تطعيم
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Icons.X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم الجرعة / التطعيم *</label>
                            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm" placeholder="مثال: تطعيم نيوكاسل" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تاريخ الجرعة *</label>
                            <input required type="date" value={dateGiven} onChange={e => setDateGiven(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">تاريخ الجرعة القادمة (اختياري)</label>
                            <input type="date" value={nextDueDate} onChange={e => setNextDueDate(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm" />
                        </div>

                        <div className="md:col-span-2 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-xl border border-gray-100 dark:border-slate-700 space-y-4">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">المستهدف بالجرعة</h4>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الفئة</label>
                                <select value={targetType} onChange={e => setTargetType(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm">
                                    <option value="0">طائر محدد</option>
                                    <option value="1">قفص / مطار</option>
                                    <option value="2">كل المزرعة (جماعي)</option>
                                </select>
                            </div>

                            {targetType === "0" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اختر الطائر</label>
                                    <select value={targetBirdId} onChange={e => setTargetBirdId(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm">
                                        <option value="">-- اختر --</option>
                                        {birds.map((b: any) => <option key={b.id} value={b.id}>{b.identifier}</option>)}
                                    </select>
                                </div>
                            )}

                            {targetType === "1" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اختر القفص</label>
                                    <select value={targetCageId} onChange={e => setTargetCageId(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm">
                                        <option value="">-- اختر --</option>
                                        {cages.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="md:col-span-2 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/30 space-y-4">
                            <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-500 mb-2">الخصم من المخزون (اختياري)</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اختر الصنف المستهلك</label>
                                    <select value={inventoryItemId} onChange={e => setInventoryItemId(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm">
                                        <option value="">-- لا يخصم من المخزون --</option>
                                        {inventoryItems.map((i: any) => <option key={i.id} value={i.id}>{i.name} (متاح: {i.quantity} {i.unit})</option>)}
                                    </select>
                                </div>
                                {inventoryItemId && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الكمية المسحوبة</label>
                                        <input type="number" step="0.01" value={quantityUsed} onChange={e => setQuantityUsed(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm" placeholder="مثال: 5" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ملاحظات</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm" placeholder="أي تفاصيل أخرى..." />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 dark:border-slate-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg">إلغاء</button>
                        <button type="submit" disabled={isSaving} className="px-6 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg disabled:opacity-50">
                            {isSaving ? 'جاري الحفظ...' : 'حفظ الجرعة'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

