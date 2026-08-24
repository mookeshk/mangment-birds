"use client";
import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

import HealthModal from './HealthModal';

export default function HealthPage() {
    const { user, fetchWithAuth } = useAuth();
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inventoryItems, setInventoryItems] = useState<any[]>([]);
    const [birds, setBirds] = useState<any[]>([]);
    const [cages, setCages] = useState<any[]>([]);

    const loadData = async () => {
        try {
            const [healthRes, invRes, birdsRes, cagesRes] = await Promise.all([
                fetchWithAuth('/api/health'),
                fetchWithAuth('/api/inventory'),
                fetchWithAuth('/api/birds'),
                fetchWithAuth('/api/cages')
            ]);
            
            if (healthRes.ok) setRecords(await healthRes.json());
            if (invRes.ok) setInventoryItems(await invRes.json());
            if (birdsRes.ok) setBirds(await birdsRes.json());
            if (cagesRes.ok) setCages(await cagesRes.json());
            
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) loadData();
    }, [user]);

    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من الحذف؟')) return;
        try {
            const res = await fetchWithAuth(`/api/health/${id}`, { method: 'DELETE' });
            if (res.ok) loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const getTargetText = (record: any) => {
        if (record.targetType === 0) return `طائر: ${record.targetBird?.identifier || 'غير معروف'}`;
        if (record.targetType === 1) return `قفص: ${record.targetCage?.name || 'غير معروف'}`;
        return 'كل المزرعة';
    };

    if (!user) return null;

    return (<>
        
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                                <Icons.Heart className="w-8 h-8 text-rose-500" />
                                الصحة، العلاجات، والتغذية
                            </h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                إدارة التطعيمات، الجرعات، والسجل الطبي للطيور
                            </p>
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors font-medium">
                            <Icons.Plus className="w-5 h-5" />
                            إضافة جرعة جديدة
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div></div>
                    ) : (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-right">
                                    <thead>
                                        <tr className="bg-gray-50/50 dark:bg-slate-700/30 text-gray-500 dark:text-gray-400 text-sm">
                                            <th className="px-6 py-4 font-medium">الجرعة / التطعيم</th>
                                            <th className="px-6 py-4 font-medium">التاريخ</th>
                                            <th className="px-6 py-4 font-medium">المستهدف</th>
                                            <th className="px-6 py-4 font-medium">المخزون المسحوب</th>
                                            <th className="px-6 py-4 font-medium">الجرعة القادمة</th>
                                            <th className="px-6 py-4 font-medium text-center">الإجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                        {records.map(record => (
                                            <tr key={record.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-700/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-gray-900 dark:text-white">{record.title}</div>
                                                    {record.notes && <div className="text-xs text-gray-500 mt-1">{record.notes}</div>}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(record.dateGiven).toLocaleDateString('ar-EG')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2.5 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-medium">
                                                        {getTargetText(record)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {record.inventoryItem ? `${record.quantityUsed} ${record.inventoryItem.unit} من ${record.inventoryItem.name}` : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {record.nextDueDate ? (
                                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${new Date(record.nextDueDate) < new Date() ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                            {new Date(record.nextDueDate).toLocaleDateString('ar-EG')}
                                                        </span>
                                                    ) : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <button onClick={() => handleDelete(record.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Icons.Trash className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {records.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                                    لا توجد سجلات طبية
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <HealthModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={loadData}
                inventoryItems={inventoryItems}
                birds={birds}
                cages={cages}
            />
        </>
    );
}




