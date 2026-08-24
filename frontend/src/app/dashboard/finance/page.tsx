'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from "../../../contexts/AuthContext";

const Icons = {
    Leaf: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 2C15.5 2 13.5 3 12 4.5C10.5 3 8.5 2 6.5 2C3 2 1 5 1 8.5C1 13 6.5 18 12 22C17.5 18 23 13 23 8.5C23 5 21 2 17.5 2ZM12 19.5C8 16.5 3 12 3 8.5C3 6.5 4.5 5 6.5 5C8 5 9.5 6 10.5 7L12 8.5L13.5 7C14.5 6 16 5 17.5 5C19.5 5 21 6.5 21 8.5C21 12 16 16.5 12 19.5Z"/></svg>,
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Minus: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>,
    TrendingUp: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    TrendingDown: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
    Wallet: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    Receipt: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    Close: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    AlertCircle: ({ className = "w-6 h-6" }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
};

const AIFarmAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'model', text: 'مرحباً! أنا مساعد مزرعتي. هل تحتاج إلى مراجعة مصروفاتك أو تحليل أرباحك لهذا الشهر؟' }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', text: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'model', text: "بناءً على سجلاتك، يمثل العلف 70% من إجمالي مصروفاتك. يُنصح بمقارنة أسعار الموردين لتقليل التكلفة وزيادة هامش الربح." }]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50" dir="rtl">
            {isOpen && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 w-[22rem] sm:w-[24rem] mb-4 flex flex-col h-[32rem] transform origin-bottom-right transition-all">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-4 text-white flex justify-between items-center shadow-md rounded-t-3xl">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">مساعد مزرعتي الذكي</h3>
                                <span className="text-xs text-emerald-100 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span> متصل
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors">
                            <Icons.Close />
                        </button>
                    </div>
                    
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 dark:bg-slate-900/50 flex flex-col gap-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-emerald-500 text-white rounded-br-sm' 
                                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-slate-700 rounded-bl-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-end">
                                <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-100 dark:border-slate-700 shadow-sm flex gap-1.5 items-center">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 flex gap-2 items-center rounded-b-3xl">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="اسأل عن أي شيء..." className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-slate-900 border border-transparent focus:border-emerald-500/30 rounded-full text-sm focus:outline-none focus:ring-0 text-gray-800 dark:text-white transition-all"/>
                        <button type="submit" disabled={isLoading || !input.trim()} className="bg-emerald-500 text-white p-2.5 rounded-full hover:bg-emerald-600 disabled:opacity-50 transition-colors flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform -rotate-90 rtl:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </form>
                </div>
            )}
            {!isOpen && (
                <button onClick={() => setIsOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-4 shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </button>
            )}
        </div>
    );
};

export default function FinanceDashboard() {
    const { fetchWithAuth } = useAuth();
    const [data, setData] = useState({
        salesThisMonth: 0,
        totalSales: 0,
        totalExpenses: 0,
        netProfit: 0,
        transactions: [] as any[]
    });
    
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [confirmState, setConfirmState] = useState<{isOpen: boolean; txn: any}>({ isOpen: false, txn: null });

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        entity: '',
        notes: ''
    });

    const loadData = async () => {
        try {
            const res = await fetchWithAuth('/api/finance/dashboard');
            if (res.ok) {
                setData(await res.json());
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const openModal = (type: 'income' | 'expense', item: any = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                title: item.title,
                category: '',
                amount: item.amount,
                date: item.date,
                entity: item.entity,
                notes: item.notes || ''
            });
        } else {
            setEditingItem(null);
            setFormData({
                title: '', category: '', amount: 0, 
                date: new Date().toISOString().split('T')[0], 
                entity: '', notes: ''
            });
        }
        if (type === 'income') setIsIncomeModalOpen(true);
        else setIsExpenseModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent, type: 'income' | 'expense') => {
        e.preventDefault();
        
        let url = type === 'income' ? '/api/finance/income' : '/api/finance/expense';
        let method = 'POST';

        if (editingItem) {
            method = 'PUT';
            const realId = editingItem.id.split('_')[1];
            url = `${url}/${realId}`;
        }
        
        try {
            const res = await fetchWithAuth(url, {
                method: method,
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                if(type === 'income') setIsIncomeModalOpen(false);
                else setIsExpenseModalOpen(false);
                loadData();
            } else {
                alert("حدث خطأ أثناء الحفظ");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const confirmDelete = (txn: any) => {
        setConfirmState({ isOpen: true, txn });
    };

    const handleDelete = async () => {
        if (!confirmState.txn) return;
        const txn = confirmState.txn;
        const typeUrl = txn.type === 'income' ? '/api/finance/income' : '/api/finance/expense';
        const realId = txn.id.split('_')[1];
        
        try {
            const res = await fetchWithAuth(`${typeUrl}/${realId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setConfirmState({ isOpen: false, txn: null });
                loadData();
            } else {
                alert("حدث خطأ أثناء الحذف");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 relative">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Page Header & Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">الإدارة المالية والمبيعات</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">تتبع إيراداتك ومصروفاتك وحلل أرباح مزرعتك بسهولة.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button onClick={() => openModal('expense')} className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm">
                            <Icons.Minus /> إضافة مصروفات
                        </button>
                        <button onClick={() => openModal('income')} className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5">
                            <Icons.Plus /> تسجيل عملية بيع
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Sales Card */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group border-r-4 border-r-emerald-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">إجمالي المبيعات (هذا الشهر)</p>
                                <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{data.salesThisMonth.toLocaleString()} <span className="text-lg font-normal text-gray-400">ج.م</span></h3>
                            </div>
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-500">
                                <Icons.TrendingUp />
                            </div>
                        </div>
                    </div>

                    {/* Expenses Card */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group border-r-4 border-r-red-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">إجمالي المصروفات</p>
                                <h3 className="text-3xl font-extrabold text-red-600 dark:text-red-400">{data.totalExpenses.toLocaleString()} <span className="text-lg font-normal text-gray-400">ج.م</span></h3>
                            </div>
                            <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl text-red-500">
                                <Icons.TrendingDown />
                            </div>
                        </div>
                    </div>

                    {/* Profit Card */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden group border-r-4 border-r-blue-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">صافي الأرباح</p>
                                <h3 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{data.netProfit.toLocaleString()} <span className="text-lg font-normal text-gray-400">ج.م</span></h3>
                            </div>
                            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-blue-500">
                                <Icons.Wallet />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Transactions Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Icons.Receipt /> سجل المعاملات الأخيرة
                        </h3>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">التاريخ</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">التفاصيل / الصنف</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">الجهة / الطرف الثاني</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">المبلغ</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {data.transactions.length > 0 ? data.transactions.map((txn: any) => (
                                    <tr key={txn.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-900/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium">
                                            {txn.date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-semibold text-gray-900 dark:text-white text-sm">{txn.title}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{txn.type === 'income' ? 'إيرادات مبيعات' : 'مصروفات تشغيل'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            {txn.entity || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`text-sm font-bold flex items-center gap-1 ${
                                                txn.type === 'income' 
                                                ? 'text-emerald-600 dark:text-emerald-400' 
                                                : 'text-red-600 dark:text-red-400'
                                            }`}>
                                                {txn.type === 'income' ? '+' : '-'} {txn.amount} ج.م
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-3">
                                            <button onClick={() => openModal(txn.type, txn)} className="text-gray-400 hover:text-emerald-500 transition-colors" title="تعديل">
                                                ✏️
                                            </button>
                                            <button onClick={() => confirmDelete(txn)} className="text-gray-400 hover:text-red-500 transition-colors" title="حذف">
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            لا توجد معاملات مسجلة بعد.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Income Modal */}
            {isIncomeModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700" dir="rtl">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">تسجيل عملية بيع (إيراد)</h3>
                            <button onClick={() => setIsIncomeModalOpen(false)} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"><Icons.Close /></button>
                        </div>
                        <form onSubmit={(e) => handleSave(e, 'income')} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">البيان / عنوان المبيعة</label>
                                <input required type="text" placeholder="مثال: بيع طائر كوكتيل أو 10 حبات بيض" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المبلغ (ج.م)</label>
                                    <input required type="number" step="0.01" value={formData.amount || ''} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">التاريخ</label>
                                    <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم المشتري (اختياري)</label>
                                <input type="text" value={formData.entity} onChange={e => setFormData({...formData, entity: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white" />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="submit" className="flex-1 bg-emerald-500 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-600 transition-colors">حفظ الإيراد</button>
                                <button type="button" onClick={() => setIsIncomeModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-200 py-2.5 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Expense Modal */}
            {isExpenseModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700" dir="rtl">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">إضافة مصروفات تشغيل</h3>
                            <button onClick={() => setIsExpenseModalOpen(false)} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"><Icons.Close /></button>
                        </div>
                        <form onSubmit={(e) => handleSave(e, 'expense')} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">البيان / عنوان المصروف</label>
                                <input required type="text" placeholder="مثال: شراء علف حمام مخلوط (50 كجم)" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">المبلغ (ج.م)</label>
                                    <input required type="number" step="0.01" value={formData.amount || ''} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">التاريخ</label>
                                    <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الجهة / المورد (اختياري)</label>
                                <input type="text" value={formData.entity} onChange={e => setFormData({...formData, entity: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white" />
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="submit" className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-bold hover:bg-red-600 transition-colors">حفظ المصروف</button>
                                <button type="button" onClick={() => setIsExpenseModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-200 py-2.5 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {confirmState.isOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center border border-gray-100 dark:border-slate-700" dir="rtl">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icons.AlertCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">تأكيد الحذف</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            هل أنت متأكد من حذف هذه المعاملة ({confirmState.txn?.title})؟ لا يمكن التراجع عن هذا الإجراء.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={handleDelete} className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-bold hover:bg-red-600 transition-colors">
                                نعم، احذف
                            </button>
                            <button onClick={() => setConfirmState({ isOpen: false, txn: null })} className="flex-1 bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-200 py-2.5 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <AIFarmAssistant />
        </div>
    );
}
