"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('https://mangment-birds-api.onrender.com/resetPassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, resetCode, newPassword })
            });

            if (res.ok) {
                setSuccess(true);
            } else {
                const data = await res.json();
                setError(data.title || 'بيانات غير صحيحة أو رمز منتهي الصلاحية');
            }
        } catch (err: any) {
            setError('تعذر الاتصال بالخادم.');
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4" dir="rtl">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 w-full max-w-md text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                    <h1 className="text-2xl font-bold mb-2">تم بنجاح!</h1>
                    <p className="text-slate-500 mb-6">لقد تم تغيير كلمة المرور الخاصة بك بنجاح.</p>
                    <Link href="/" className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-bold transition-colors">
                        الذهاب لتسجيل الدخول
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">إعادة تعيين كلمة المرور</h1>
                    <p className="text-slate-500">أدخل الرمز الذي وصلك على البريد وكلمة المرور الجديدة</p>
                </div>

                {error && <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="text-gray-900 dark:text-white w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="example@domain.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">رمز الاستعادة (المُرسل لك)</label>
                        <input
                            type="text"
                            required
                            value={resetCode}
                            onChange={(e) => setResetCode(e.target.value)}
                            className="text-gray-900 dark:text-white w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-left"
                            dir="ltr"
                            placeholder="مثال: CfDJ8..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">كلمة المرور الجديدة</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="text-gray-900 dark:text-white w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-left"
                            dir="ltr"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-bold transition-colors disabled:opacity-50 mt-4"
                    >
                        {loading ? 'جاري الحفظ...' : 'تغيير كلمة المرور'}
                    </button>
                </form>
            </div>
        </div>
    );
}

