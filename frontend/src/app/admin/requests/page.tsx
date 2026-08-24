"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { Icons } from "../../../components/Icons";

export default function RequestsPage() {
    const { fetchWithAuth } = useAuth();
    const [requests, setRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setIsLoading(true);
        try {
            const res = await fetchWithAuth("/api/admin/requests");
            if (res.ok) setRequests(await res.json());
        } catch (e) { }
        setIsLoading(false);
    };

    const handleAction = async (id: number, action: 'approve' | 'reject') => {
        try {
            await fetchWithAuth(`/api/admin/requests/${id}/${action}`, { method: "POST" });
            loadRequests();
        } catch (e) { }
    };

    if (isLoading) return <div className="text-center p-8 text-emerald-500 font-bold">جاري التحميل...</div>;

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-[#334155] overflow-hidden flex flex-col min-h-[500px]">
                
                {/* Header */}
                <div className="p-5 border-b border-gray-100 dark:border-[#334155] bg-gray-50/50 dark:bg-[#0f172a]/50">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Icons.List className="w-5 h-5 text-emerald-500" />
                        طلبات الاشتراك
                    </h2>
                </div>

                {/* Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-[#0f172a]/80 border-b border-gray-100 dark:border-[#334155]">
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">تاريخ الطلب</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">صاحب الطلب</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">الباقة</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">الإيصال</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap">الحالة</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-600 dark:text-gray-300 whitespace-nowrap text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                        لا يوجد طلبات حالياً.
                                    </td>
                                </tr>
                            ) : requests.map(req => (
                                <tr key={req.id} className="hover:bg-gray-50/50 dark:hover:bg-[#0f172a]/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-300">{new Date(req.requestDate).toLocaleDateString('ar-EG')}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">{req.farmName || 'بدون اسم'}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{req.userEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-300">{req.packageName}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <a href={`https://mangment-birds-api.onrender.com${req.receiptUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline">
                                            <Icons.Camera className="w-4 h-4" /> عرض الإيصال
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                            req.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                            req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                            'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                                        }`}>
                                            {req.status === 'Pending' ? 'معلق' : req.status === 'Approved' ? 'مقبول' : 'مرفوض'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {req.status === 'Pending' ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleAction(req.id, 'approve')} className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg text-xs font-bold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                                                    <Icons.Check className="w-4 h-4" /> قبول
                                                </button>
                                                <button onClick={() => handleAction(req.id, 'reject')} className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 rounded-lg text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50">
                                                    <Icons.Close className="w-4 h-4" /> رفض
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-sm">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
