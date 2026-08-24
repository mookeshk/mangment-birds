"use client";
import React, { useState, useEffect } from 'react';

const Icons = {
    Close: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
};

export default function ConsumeModal({ isOpen, onClose, item, onSubmit }: { isOpen: boolean, onClose: () => void, item: any, onSubmit: (id: number, quantity: number, date: string, notes: string) => void }) {
    const [quantity, setQuantity] = useState("");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        if (isOpen) {
            setQuantity("");
            setDate(new Date().toISOString().split('T')[0]);
            setNotes("");
        }
    }, [isOpen]);

    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">صرف مخزون: {item.name}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><Icons.Close /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الكمية المسحوبة (الكمية الحالية: {item.quantity} {item.unit})</label>
                        <input type="number" step="0.01" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">التاريخ</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ملاحظات / سبب الصرف</label>
                        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg" placeholder="مثال: تغذية يومية للعنبر أ" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg">إلغاء</button>
                        <button type="button" onClick={() => { onSubmit(item.id, parseFloat(quantity), new Date(date).toISOString(), notes); onClose(); }} className="px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg">تأكيد الصرف</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
