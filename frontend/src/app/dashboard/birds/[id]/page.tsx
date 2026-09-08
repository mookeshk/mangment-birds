"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import Link from 'next/link';
import QRCode from 'react-qr-code';

export default function BirdProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { fetchWithAuth } = useAuth();
  const id = params?.id as string;
  
  const [bird, setBird] = useState<any>(null);
  const [allBirds, setAllBirds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [birdRes, allBirdsRes] = await Promise.all([
        fetchWithAuth(`/api/Birds/${id}`),
        fetchWithAuth('/api/Birds')
      ]);

      if (birdRes.ok) setBird(await birdRes.json());
      if (allBirdsRes.ok) setAllBirds(await allBirdsRes.json());
      
    } catch (err) {
      console.error("Error loading bird:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex h-[80vh] items-center justify-center text-emerald-600 font-bold">جاري تحميل البيانات...</div>;
  if (!bird) return <div className="flex h-[80vh] items-center justify-center text-red-500 font-bold text-xl">الطائر غير موجود أو لا تملك صلاحية الوصول إليه.</div>;

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return { text: 'في مرحلة النمو (متاح)', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' };
      case 1: return { text: 'منتج (متاح)', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' };
      case 2: return { text: 'في دورة تزاوج', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' };
      case 3: return { text: 'نافق', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
      case 4: return { text: 'مفقود / هارب', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' };
      case 5: return { text: 'مباع', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' };
      default: return { text: 'غير محدد', color: 'bg-slate-100 text-slate-800' };
    }
  };

  const statusInfo = getStatusText(bird.status);
  
  const father = allBirds.find(b => b.id === bird.fatherId);
  const mother = allBirds.find(b => b.id === bird.motherId);
  const offspring = allBirds.filter(b => b.fatherId === bird.id || b.motherId === bird.id);

  // Use the origin URL instead of localhost for the QR code
  const qrCodeValue = typeof window !== 'undefined' ? `${window.location.origin}/dashboard/birds/${bird.id}` : '';

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                الملف الشخصي للطائر: <span className="text-emerald-600 dark:text-emerald-500">{bird.identifier}</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">النوع: {bird.speciesName} - الفصيلة: {bird.breedName || 'غير محدد'}</p>
        </div>
        <button 
            onClick={() => router.push('/dashboard/birds')}
            className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-all"
        >
            العودة للقائمة
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Right Column: Main Info & Image */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                <div className="h-64 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center border-b border-gray-100 dark:border-gray-800 relative">
                    {bird.photoUrl ? (
                        <img src={`https://mangment-birds-api.onrender.com${bird.photoUrl}`} alt="صورة الطائر" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-gray-400 flex flex-col items-center">
                            <svg className="w-16 h-16 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <span>لا توجد صورة</span>
                        </div>
                    )}
                    <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${statusInfo.color}`}>
                            {statusInfo.text}
                        </span>
                    </div>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-gray-500 dark:text-gray-400">الجنس</span>
                        <span className={`font-bold ${bird.isMale ? 'text-blue-600 dark:text-blue-400' : 'text-pink-600 dark:text-pink-400'}`}>
                            {bird.isMale ? 'ذكر ♂' : 'أنثى ♀'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-gray-500 dark:text-gray-400">تاريخ الفقس / الشراء</span>
                        <span className="font-bold text-gray-900 dark:text-white font-mono">
                            {bird.hatchDate ? new Date(bird.hatchDate).toLocaleDateString('ar-EG') : 'غير محدد'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400">العمر التقريبي</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                            {bird.hatchDate ? (() => {
                                const age = new Date().getTime() - new Date(bird.hatchDate).getTime();
                                const days = Math.floor(age / (1000 * 60 * 60 * 24));
                                if (days < 30) return `${days} يوم`;
                                const months = Math.floor(days / 30);
                                if (months < 12) return `${months} شهر`;
                                const years = Math.floor(months / 12);
                                const remMonths = months % 12;
                                return `${years} سنة${remMonths > 0 ? ` و ${remMonths} شهر` : ''}`;
                            })() : 'غير معروف'}
                        </span>
                    </div>
                </div>
            </div>

            {/* QR Code */}
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col items-center shadow-sm">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 w-full text-center">رمز الاستجابة السريعة (QR)</h3>
                <div className="p-4 bg-white rounded-xl border border-gray-200">
                    <QRCode value={qrCodeValue} size={150} />
                </div>
                <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
                    امسح هذا الرمز باستخدام هاتفك المحمول للوصول السريع إلى هذه الصفحة.
                </p>
                <button onClick={() => window.print()} className="mt-4 w-full py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-lg font-bold transition-colors">
                    طباعة الرمز
                </button>
            </div>
        </div>

        {/* Left Column: Family Tree & Offspring */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Parents Lineage */}
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                    شجرة العائلة (الأصول)
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Father */}
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-800/30 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-xl">♂</div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">الأب</p>
                            {father ? (
                                <Link href={`/dashboard/birds/${father.id}`} className="font-bold text-lg text-emerald-600 hover:underline">{father.identifier}</Link>
                            ) : (
                                <span className="font-bold text-lg text-gray-400">غير مسجل بالسيستم</span>
                            )}
                        </div>
                    </div>
                    {/* Mother */}
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-800/30 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 flex items-center justify-center text-xl">♀</div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1">الأم</p>
                            {mother ? (
                                <Link href={`/dashboard/birds/${mother.id}`} className="font-bold text-lg text-emerald-600 hover:underline">{mother.identifier}</Link>
                            ) : (
                                <span className="font-bold text-lg text-gray-400">غير مسجلة بالسيستم</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Offspring */}
            <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        الإنتاج (الفروع والأبناء)
                    </h2>
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 font-bold rounded-lg text-sm">
                        إجمالي الإنتاج: {offspring.length}
                    </span>
                </div>
                
                {offspring.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {offspring.map((child: any) => (
                            <Link href={`/dashboard/birds/${child.id}`} key={child.id}>
                                <div className="group p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/10 transition-all flex items-center justify-between cursor-pointer bg-gray-50 dark:bg-slate-800/30">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${child.isMale ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                                            {child.isMale ? '♂' : '♀'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600">{child.identifier}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{child.hatchDate ? new Date(child.hatchDate).toLocaleDateString('ar-EG') : 'عمر غير محدد'}</p>
                                        </div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-emerald-500 transform rtl:-scale-x-100 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                        <svg className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        <p className="text-gray-500 dark:text-gray-400 font-bold">لم يسجل أي إنتاج لهذا الطائر في السيستم حتى الآن.</p>
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
}
