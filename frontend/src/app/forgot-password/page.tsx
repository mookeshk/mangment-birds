"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await fetch('/forgotPassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                setCooldown(60);
                setMessage('تم إرسال رمز استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح. يرجى مراجعة صندوق الوارد.');
            } else {
                const data = await res.json();
                setError(data.title || 'حدث خطأ. يرجى التأكد من البريد الإلكتروني.');
            }
        } catch (err: any) {
            setError('تعذر الاتصال بالخادم.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4" dir="rtl">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">استعادة كلمة المرور</h1>
                    <p className="text-slate-500">أدخل بريدك الإلكتروني وسنرسل لك رمزاً لإعادة تعيين كلمة مرورك</p>
                </div>

                {message && <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl mb-6">{message}</div>}
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
                    <button
                        type="submit"
                        disabled={loading || cooldown > 0}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-bold transition-colors disabled:opacity-50"
                    >
                        {loading ? 'جاري الإرسال...' : cooldown > 0 ? `انتظر ${cooldown} ثانية...` : 'إرسال الرمز'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-emerald-600 font-medium hover:underline block mb-4">العودة لتسجيل الدخول</Link>`n                    {message && <Link href="/reset-password" className="text-blue-600 font-medium hover:underline block mt-4">إدخال الرمز الآن ➔</Link>}
                </div>
            </div>
        </div>
    );
}




