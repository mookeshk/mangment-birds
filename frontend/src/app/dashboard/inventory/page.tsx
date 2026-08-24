'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from "../../../contexts/AuthContext";
import ConfirmModal from "../../../components/ConfirmModal";
import ConsumeModal from "./ConsumeModal";

const Icons = {
    Wheat: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Search: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Edit: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
    Trash: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    AlertTriangle: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    Package: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    Wallet: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    Close: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
};

const AIFarmAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'model', text: 'مرحباً! أنا مساعد مزرعتي. هل تحتاج مساعدة في جرد العلف أو معرفة أفضل تركيبة غذائية لطيورك؟' }]);
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
            setMessages(prev => [...prev, { role: 'model', text: "تأكد من تخزين العلف في مكان جاف بعيداً عن الرطوبة المباشرة لتجنب تكون السموم الفطرية التي تؤثر على إنتاج البيض." }]);
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

export default function InventoryPage() {
    const { fetchWithAuth } = useAuth();
    const [inventory, setInventory] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Inventory Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', categoryId: '', quantity: 0, unit: 'كجم', warningLimit: 10, criticalLimit: 5, price: 0, recordAsExpense: true });
    
    // Categories Modal
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const [isConsumeModalOpen, setIsConsumeModalOpen] = useState(false);
    const [itemToConsume, setItemToConsume] = useState<any>(null);
    const [newCatName, setNewCatName] = useState('');

    const [confirmState, setConfirmState] = useState<{ isOpen: boolean; title: string; message: string; action: () => Promise<void>; }>({ isOpen: false, title: '', message: '', action: async () => {} });

    
    const handleConsume = async (id: number, quantity: number, date: string, notes: string) => {
        try {
            await fetchWithAuth(`/api/inventory/${id}/consume`, {
                method: 'POST',
                body: JSON.stringify({ quantity, date, notes })
            });
            setIsConsumeModalOpen(false);
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const loadData = async () => {
        try {
            const res = await fetchWithAuth('/api/inventory');
            if (res.ok) setInventory(await res.json());
            
            const catRes = await fetchWithAuth('/api/inventorycategories');
            if (catRes.ok) setCategories(await catRes.json());
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (categories.length > 0 && !formData.categoryId) {
            setFormData(prev => ({ ...prev, categoryId: categories[0].id.toString() }));
        }
    }, [categories, formData.categoryId]);

    const filteredInventory = useMemo(() => {
        return inventory.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.categoryName && item.categoryName.includes(searchQuery))
        );
    }, [inventory, searchQuery]);

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'good': 
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> مستقر</span>;
            case 'warning': 
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> يرجى الطلب</span>;
            case 'critical': 
                return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 animate-pulse"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> حرج جداً</span>;
            default: 
                return null;
        }
    };

    const openModal = (item?: any) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name, categoryId: item.categoryId?.toString() || '', quantity: item.quantity,
                unit: item.unit, warningLimit: item.warningLimit, criticalLimit: item.criticalLimit, price: item.price,
                recordAsExpense: false // Default to false when editing existing item to avoid double-charging unless they are actually adding stock
            });
        } else {
            setEditingItem(null);
            setFormData({ name: '', categoryId: categories.length > 0 ? categories[0].id.toString() : '', quantity: 0, unit: 'كجم', warningLimit: 10, criticalLimit: 5, price: 0, recordAsExpense: true });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = editingItem ? 'PUT' : 'POST';
            const url = editingItem ? `/api/inventory/${editingItem.id}` : '/api/inventory';
            const res = await fetchWithAuth(url, {
                method,
                body: JSON.stringify({
                    ...formData,
                    categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
                })
            });

            if (res.ok) {
                setIsModalOpen(false);
                loadData();
            } else {
                alert("حدث خطأ أثناء الحفظ");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const confirmDelete = (id: number) => {
        setConfirmState({
            isOpen: true,
            title: 'حذف الصنف',
            message: 'هل أنت متأكد أنك تريد حذف هذا الصنف من المخزون؟ لا يمكن التراجع عن هذا الإجراء.',
            action: async () => {
                const res = await fetchWithAuth(`/api/inventory/${id}`, { method: 'DELETE' });
                if (res.ok) {
                    loadData();
                } else {
                    alert("حدث خطأ أثناء الحذف");
                }
                setConfirmState(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    // Category Functions
    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newCatName.trim()) return;
        const res = await fetchWithAuth('/api/inventorycategories', {
            method: 'POST',
            body: JSON.stringify({ name: newCatName })
        });
        if(res.ok) {
            const addedCat = await res.json();
            setNewCatName('');
            loadData();
            if (!formData.categoryId) {
                setFormData(prev => ({ ...prev, categoryId: addedCat.id.toString() }));
            }
        }
    };
    
    const deleteCategory = async (id: number) => {
        const res = await fetchWithAuth(`/api/inventorycategories/${id}`, { method: 'DELETE' });
        if(res.ok) {
            loadData();
        } else {
            const err = await res.text();
            alert(err);
        }
    };


    const totalValue = inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const criticalItemsCount = inventory.filter(i => i.status === 'critical').length;

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                            <Icons.Package />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">إجمالي الأصناف</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{inventory.length} <span className="text-sm font-normal text-gray-500">صنف متاح</span></h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                            <Icons.AlertTriangle />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">نواقص المخزون</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{criticalItemsCount} <span className="text-sm font-normal text-red-500 animate-pulse">يحتاج لطلب</span></h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                            <Icons.Wallet />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">قيمة المخزون المقدرة</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalValue.toLocaleString('en-US')} <span className="text-sm font-normal text-gray-500">ج.م</span></h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col min-h-[500px]">
                    
                    <div className="p-5 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400 hidden sm:block">
                                <Icons.Wheat />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">مخزون العلف الحالي</h2>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <div className="relative group w-full sm:w-64">
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500">
                                    <Icons.Search />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pr-10 pl-3 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"
                                    placeholder="ابحث عن صنف معين..."
                                />
                            </div>
                            <button onClick={() => openModal()} className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 whitespace-nowrap">
                                <Icons.Plus /> إضافة كمية جديدة
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
                                    <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300">الصنف</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300">الكمية المتبقية</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300">حالة المخزون</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300">سعر الوحدة</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300">آخر تحديث</th>
                                    <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300 text-center">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                                {filteredInventory.length > 0 ? (
                                    filteredInventory.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-700/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-bold text-gray-900 dark:text-white text-sm">{item.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">تصنيف: {item.categoryName}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-base font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-900 px-3 py-1 rounded-lg">
                                                    {item.quantity} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">{item.unit}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(item.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-medium">
                                                {item.price} ج.م
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(item.lastUpdated).toLocaleDateString('ar-EG')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => { setItemToConsume(item); setIsConsumeModalOpen(true); }} className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40 rounded-lg transition-colors" title="صرف / استهلاك">
                                                        <Icons.Wheat />
                                                    </button>
                                                    <button onClick={() => openModal(item)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 rounded-lg transition-colors" title="تعديل الكمية">
                                                        <Icons.Edit />
                                                    </button>
                                                    <button onClick={() => confirmDelete(item.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg transition-colors" title="حذف الصنف">
                                                        <Icons.Trash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            لا توجد أصناف مطابقة لبحثك.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Inventory Item Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700" dir="rtl">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                {editingItem ? 'تعديل بيانات الصنف' : 'إضافة صنف جديد'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                <Icons.Close />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">اسم الصنف</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-gray-900 dark:text-white" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">النوع</label>
                                    <div className="flex gap-2">
                                        <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white">
                                            {categories.length === 0 && <option value="">لا توجد أنواع (أضف نوعاً)</option>}
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <button type="button" onClick={() => setIsCatModalOpen(true)} className="p-2 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition" title="إدارة الأنواع">
                                            <Icons.Edit />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الوحدة</label>
                                    <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white">
                                        <option value="كجم">كجم</option>
                                        <option value="جرام">جرام</option>
                                        <option value="لتر">لتر</option>
                                        <option value="مل">مل</option>
                                        <option value="عبوة">عبوة</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">الكمية الحالية</label>
                                    <input required type="number" step="0.01" value={Number.isNaN(formData.quantity) ? '' : formData.quantity} onChange={e => setFormData({...formData, quantity: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">سعر الوحدة (ج.م)</label>
                                    <input required type="number" step="0.01" value={Number.isNaN(formData.price) ? '' : formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" title="يظهر تحذير (يرجى الطلب) إذا قلت الكمية عن هذا الحد">حد التحذير</label>
                                    <input required type="number" step="0.01" value={Number.isNaN(formData.warningLimit) ? '' : formData.warningLimit} onChange={e => setFormData({...formData, warningLimit: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" title="تصبح الحالة (حرج جداً) إذا قلت الكمية عن هذا الحد">حد الطلب (حرج)</label>
                                    <input required type="number" step="0.01" value={Number.isNaN(formData.criticalLimit) ? '' : formData.criticalLimit} onChange={e => setFormData({...formData, criticalLimit: parseFloat(e.target.value)})} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white border-red-300 dark:border-red-900/50" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4 bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                                <input 
                                    type="checkbox" 
                                    id="recordAsExpense"
                                    checked={formData.recordAsExpense} 
                                    onChange={e => setFormData({...formData, recordAsExpense: e.target.checked})}
                                    className="w-4 h-4 text-emerald-500 bg-white border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" 
                                />
                                <label htmlFor="recordAsExpense" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                                    {editingItem ? 'تحديث فاتورة الشراء المرتبطة في الماليات (إن وجدت) لتطابق هذا التعديل' : 'تسجيل هذه العملية كمصروف في الماليات تلقائياً'}
                                </label>
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button type="submit" className="flex-1 bg-emerald-500 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-600 transition-colors">
                                    حفظ البيانات
                                </button>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-200 py-2.5 rounded-lg font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Categories Management Modal */}
            {isCatModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700" dir="rtl">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                إدارة الأنواع
                            </h3>
                            <button onClick={() => setIsCatModalOpen(false)} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                <Icons.Close />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <form onSubmit={handleAddCategory} className="flex gap-2">
                                <input required type="text" value={newCatName} onChange={e => setNewCatName(e.target.value)} placeholder="اسم النوع الجديد..." className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white text-sm" />
                                <button type="submit" className="bg-emerald-500 text-white px-4 rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors">إضافة</button>
                            </form>

                            <div className="max-h-48 overflow-y-auto space-y-2">
                                {categories.map(cat => (
                                    <div key={cat.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-900/50 rounded-lg border border-gray-100 dark:border-slate-700">
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{cat.name}</span>
                                        <button onClick={() => deleteCategory(cat.id)} className="text-red-500 hover:text-red-700 p-1 bg-red-50 dark:bg-red-900/20 rounded">
                                            <Icons.Trash />
                                        </button>
                                    </div>
                                ))}
                                {categories.length === 0 && (
                                    <p className="text-center text-sm text-gray-500">لا توجد أنواع حالياً.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal 
                isOpen={confirmState.isOpen}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={confirmState.action}
                onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                confirmText="حذف"
                cancelText="إلغاء"
            />
            <ConsumeModal isOpen={isConsumeModalOpen} onClose={() => setIsConsumeModalOpen(false)} item={itemToConsume} onSubmit={handleConsume} />
            
            <AIFarmAssistant />
        </div>
    );
}


