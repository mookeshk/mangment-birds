"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Icons } from '@/components/Icons';

export default function SubscriptionTab() {
    const { user, fetchWithAuth, refreshUser } = useAuth();
    const [packages, setPackages] = useState<any[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [status, setStatus] = useState<'None' | 'Pending' | 'Active'>('None');
    const [activeRequest, setActiveRequest] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSubscriptionData();
    }, []);

    const loadSubscriptionData = async () => {
        setIsLoading(true);
        try {
            const reqRes = await fetchWithAuth('/api/user/subscription/request');
            if (reqRes.ok) {
                const req = await reqRes.json();
                if (req) {
                    setActiveRequest(req);
                    setStatus(req.status === 'Pending' ? 'Pending' : 'Active');
                    setIsLoading(false);
                    return;
                }
            }

            const activeRes = await fetchWithAuth('/api/user/subscription/active');
            if (activeRes.ok) {
                const active = await activeRes.json();
                if (active) {
                    setStatus('Active');
                    setIsLoading(false);
                    return;
                }
            }

            const pkgRes = await fetchWithAuth('/api/user/subscription/packages');
            if (pkgRes.ok) setPackages(await pkgRes.json());
        } catch (e) {}
        setIsLoading(false);
    };

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPackage || !receiptFile) return;

        const formData = new FormData();
        formData.append('packageId', selectedPackage.id);
        formData.append('receipt', receiptFile);

        try {
            const res = await fetchWithAuth('/api/user/subscription/subscribe', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                setMessage({ text: 'تم إرسال طلب الاشتراك بنجاح. في انتظار موافقة الإدارة.', type: 'success' });
                loadSubscriptionData();
            } else {
                setMessage({ text: 'فشل إرسال الطلب', type: 'error' });
            }
        } catch (e) {
            setMessage({ text: 'حدث خطأ في الاتصال', type: 'error' });
        }
    };

    if (isLoading) {
        return <div className="text-center py-10 text-emerald-500 font-bold">جاري التحميل...</div>;
    }

    if (status === 'Active') {
        const endDate = user?.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString('ar-EG') : 'غير محدد';
        return (
            <div className="max-w-2xl mx-auto animate-in fade-in zoom-in-95">
                {/* Success Card matching user screenshot */}
                <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-[2rem] p-10 shadow-xl shadow-emerald-500/20 text-center relative overflow-hidden">
                    
                    {/* Decorative circles */}
                    <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-xl"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-black/10 rounded-full mix-blend-overlay filter blur-xl"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Icon */}
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/30 shadow-inner">
                            <Icons.CheckCircle />
                        </div>
                        
                        <h2 className="text-3xl font-extrabold text-white mb-3">اشتراكك نشط الآن!</h2>
                        <p className="text-emerald-50 font-medium mb-10 max-w-sm">أنت تستمتع بجميع ميزات النظام حالياً. شكراً لثقتك بنا.</p>

                        {/* Plan Details Cards (Glassmorphism) */}
                        <div className="w-full max-w-sm flex flex-col gap-4">
                            {/* Card 1 */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/20 transition-colors">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                                    <Icons.PlanSettings />
                                </div>
                                <div className="text-right flex-1">
                                    <p className="text-emerald-100 text-xs font-semibold mb-0.5">نوع الباقة</p>
                                    <p className="text-white font-bold text-lg">{user?.packageName || 'باقة المزرعة'}</p>
                                </div>
                            </div>
                            
                            {/* Card 2 */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/20 transition-colors">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white">
                                    <Icons.PlanList />
                                </div>
                                <div className="text-right flex-1">
                                    <p className="text-emerald-100 text-xs font-semibold mb-0.5">تاريخ الانتهاء</p>
                                    <p className="text-white font-bold text-lg font-mono">{endDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'Pending') {
        return (
            <div className="max-w-2xl mx-auto bg-white dark:bg-[#1e293b] rounded-3xl p-10 shadow-sm border border-amber-200 dark:border-amber-900/30 text-center animate-in fade-in zoom-in-95">
                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">طلبك قيد المراجعة</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">لقد استلمنا طلب الاشتراك وإيصال الدفع. يرجى الانتظار حتى تقوم الإدارة بمراجعته وتفعيل حسابك.</p>
                <div className="inline-block bg-gray-50 dark:bg-[#0f172a] px-6 py-4 rounded-2xl border border-gray-100 dark:border-[#334155] text-right min-w-[250px]">
                    <div className="mb-2"><span className="text-gray-500 dark:text-gray-400 text-sm">تاريخ الطلب:</span> <span className="font-bold text-gray-900 dark:text-white">{new Date(activeRequest?.requestDate).toLocaleDateString('ar-EG')}</span></div>
                    <div><span className="text-gray-500 dark:text-gray-400 text-sm">الباقة المطلوبة:</span> <span className="font-bold text-gray-900 dark:text-white">{activeRequest?.packageName}</span></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95">
            {message.text && (
                <div className={`p-4 rounded-xl text-center text-sm font-bold shadow-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {message.text}
                </div>
            )}

            {!selectedPackage ? (
                <>
                    <h3 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">اختر الباقة المناسبة لمزرعتك</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {packages.map(p => (
                            <div key={p.id} onClick={() => setSelectedPackage(p)} className="bg-white dark:bg-[#1e293b] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-[#334155] text-center cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-full h-1 bg-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{p.name}</h4>
                                <div className="text-4xl font-extrabold text-emerald-500 mb-2">{p.price} <span className="text-sm text-gray-500 dark:text-gray-400">ج.م</span></div>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">لمدة {p.durationMonths} شهر</div>
                                <ul className="text-right space-y-3 mb-8">
                                    {(p.features || "").split(',').map((f: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <Icons.Check className="w-5 h-5 text-emerald-500 shrink-0" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <button className="w-full py-3 rounded-xl bg-gray-50 dark:bg-[#0f172a] text-emerald-600 dark:text-emerald-400 font-bold group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    اختيار الباقة
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-8 max-w-xl mx-auto shadow-sm border border-gray-100 dark:border-[#334155]">
                    <button onClick={() => setSelectedPackage(null)} className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 flex items-center gap-2 mb-6 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        العودة للباقات
                    </button>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">تأكيد الاشتراك</h3>
                    
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-6 mb-8 border border-emerald-100 dark:border-emerald-900/30">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600 dark:text-gray-300">الباقة المختارة:</span>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">{selectedPackage.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-300">المبلغ المطلوب تحويله:</span>
                            <span className="font-extrabold text-gray-900 dark:text-white text-xl">{selectedPackage.price} ج.م</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubscribe} className="space-y-6">
                        <div className="text-center p-6 bg-gray-50 dark:bg-[#0f172a] rounded-2xl border border-dashed border-gray-300 dark:border-gray-600">
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">يرجى تحويل المبلغ على رقم إنستاباي التالي:</p>
                            <p className="text-2xl font-bold text-emerald-500 mb-6 tracking-wider" dir="ltr">01020144994</p>
                            
                            <input 
                                type="file" 
                                accept="image/*" 
                                required
                                ref={fileInputRef}
                                onChange={e => setReceiptFile(e.target.files?.[0] || null)}
                                className="hidden"
                                id="receipt-upload"
                            />
                            <label htmlFor="receipt-upload" className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-xl hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors shadow-sm">
                                <Icons.Camera />
                                <span className="text-sm font-bold">{receiptFile ? receiptFile.name : 'إرفاق إيصال التحويل'}</span>
                            </label>
                        </div>

                        <button type="submit" disabled={!receiptFile} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40">
                            تأكيد وإرسال الطلب
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
