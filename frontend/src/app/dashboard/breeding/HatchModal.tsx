import React, { useState } from 'react';
import { useAuth } from "../../../contexts/AuthContext";

export default function HatchModal({ isOpen, onClose, eggId, session, onSuccess }: any) {
    const { fetchWithAuth } = useAuth();
    const [identifier, setIdentifier] = useState('');
    const [isMale, setIsMale] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            identifier,
            isMale,
            status: 0, // Available
            cageId: session?.cageId,
            speciesId: session?.speciesId,
            breedId: null, // As requested, leave breed unknown
            fatherId: session?.maleBirdId,
            motherId: session?.femaleBirdId
        };

        try {
            const res = await fetchWithAuth(`/api/eggs/${eggId}/hatch`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                alert("حدث خطأ أثناء حفظ بيانات الطائر.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700" dir="rtl">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">مبروك الفقس! 🐣</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        تم تسجيل فقس البيضة بنجاح. يرجى إدخال بيانات الطائر الجديد ليتم إضافته إلى سجل الطيور كإنتاج مزرعة.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                رقم الحجل / المعرف <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                required
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white transition-all"
                                placeholder="مثال: F-2023-01"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                الجنس (المتوقع)
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio"
                                        name="gender"
                                        checked={isMale === true}
                                        onChange={() => setIsMale(true)}
                                        className="w-4 h-4 text-emerald-500 bg-gray-100 border-gray-300 focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">ذكر ♂️</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio"
                                        name="gender"
                                        checked={isMale === false}
                                        onChange={() => setIsMale(false)}
                                        className="w-4 h-4 text-emerald-500 bg-gray-100 border-gray-300 focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">أنثى ♀️</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio"
                                        name="gender"
                                        checked={isMale === null}
                                        onChange={() => setIsMale(null)}
                                        className="w-4 h-4 text-emerald-500 bg-gray-100 border-gray-300 focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">غير محدد ❓</span>
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                * يمكنك تعديل الجنس لاحقاً من قسم "إدارة الطيور" إذا لم يكن معروفاً الآن.
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex gap-3">
                        <button 
                            type="submit" 
                            disabled={loading || !identifier.trim()}
                            className="flex-1 bg-emerald-500 text-white py-2.5 rounded-lg font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'جاري الحفظ...' : 'حفظ وإضافة الطائر'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

