"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

const Icons = {
    Sun: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Moon: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
    Mail: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    Lock: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
    Leaf: () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 2C15.5 2 13.5 3 12 4.5C10.5 3 8.5 2 6.5 2C3 2 1 5 1 8.5C1 13 6.5 18 12 22C17.5 18 23 13 23 8.5C23 5 21 2 17.5 2ZM12 19.5C8 16.5 3 12 3 8.5C3 6.5 4.5 5 6.5 5C8 5 9.5 6 10.5 7L12 8.5L13.5 7C14.5 6 16 5 17.5 5C19.5 5 21 6.5 21 8.5C21 12 16 16.5 12 19.5Z"/></svg>
};

export default function LoginPage() {
    const [isDark, setIsDark] = useState(true);
    useEffect(() => { const saved = localStorage.getItem('theme'); if (saved) setIsDark(saved === 'dark'); }, []);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const router = useRouter();
    const { refreshUser, user } = useAuth();

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    // If user is already logged in, redirect to dashboard
    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");
        
        try {
            const res = await fetch('https://mangment-birds-api.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.accessToken) {
                    localStorage.setItem('token', data.accessToken);
                    await refreshUser();
                    router.push('/dashboard');
                } else {
                    setErrorMsg("حدث خطأ غير متوقع أثناء تسجيل الدخول.");
                }
            } else {
                setErrorMsg("بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.");
            }
        } catch (err: any) {
            setErrorMsg("تعذر الاتصال بالخادم، يرجى التأكد من تشغيل الواجهة الخلفية.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto h-screen">
            <div className="min-h-screen flex w-full bg-white dark:bg-gray-900 transition-colors duration-500">
            {/* Right Side (Form Area) */}
            <div className="w-full lg:w-1/2 flex flex-col relative overflow-y-auto">
                <div className="flex justify-between items-center p-6 sm:p-10 w-full">
                    <div className="flex items-center gap-2">
                        <Icons.Leaf />
                        <span className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white">
                            مزرعتي <span className="text-emerald-500">.</span>
                        </span>
                    </div>
                    
                    <button 
                        onClick={() => setIsDark(!isDark)}
                        className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label="تبديل المظهر"
                    >
                        {isDark ? <Icons.Sun /> : <Icons.Moon />}
                    </button>
                </div>

                <div className="flex-1 flex flex-col justify-center px-6 sm:px-16 md:px-24 xl:px-32 pb-12">
                    <div className="w-full max-w-sm mx-auto lg:mx-0">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                            أهلاً بك في المستقبل 🚀
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm leading-relaxed">
                            قم بتسجيل الدخول للوصول إلى لوحة التحكم الخاصة بمزرعتك، تتبع الإنتاج، واتخذ قرارات مدعومة بالبيانات.
                        </p>

                        {errorMsg && (
                            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-r-4 border-red-500 text-red-600 dark:text-red-400 text-sm p-4 rounded-xl flex items-center gap-3 animate-pulse">
                                <span className="font-medium">{errorMsg}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    البريد الإلكتروني
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500">
                                        <Icons.Mail />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pr-12 pl-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"
                                        placeholder="admin@myfarm.com"
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        كلمة المرور
                                    </label>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500">
                                        <Icons.Lock />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pr-12 pl-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm tracking-widest"
                                        placeholder="••••••••"
                                        dir="ltr"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <div className="text-left mb-4">

                                    <Link href="/forgot-password" className="text-sm text-emerald-600 hover:underline">نسيت كلمة المرور؟</Link>

                                </div>

                                <button type="submit"
                                    disabled={isLoading}
                                    className={w-full flex justify-center items-center py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-900 shadow-lg shadow-emerald-500/30 transform transition-all duration-300 hover:-translate-y-0.5 }
                                >
                                    {isLoading ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <span>تسجيل الدخول <span className="mx-1">→</span></span>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400">ليس لديك حساب في النظام؟ </span>
                            <Link href="/register" className="font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 transition-colors">
                                ابدأ تجربتك المجانية
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Left Side (Visual Panel) */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 relative overflow-hidden items-center justify-center p-12">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-[float_6s_ease-in-out_infinite]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-teal-400 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-[float_6s_ease-in-out_3s_infinite]"></div>
                </div>

                <div className="relative z-10 animate-[float_6s_ease-in-out_infinite]">
                    <img src="/parrot.jpg" alt="Parrot" className="w-80 h-80 object-cover rounded-full shadow-2xl border-4 border-white/20" />
                </div>

                <div className="absolute bottom-12 left-0 right-0 text-center z-10 px-8">
                    <h2 className="text-2xl font-bold text-white mb-3 tracking-wide">أدر مزرعتك بذكاء لا مثيل له</h2>
                    <p className="text-emerald-200 text-sm max-w-md mx-auto leading-relaxed">
                        نظام سحابي متكامل يجمع بين قوة البيانات و سرعة معالجتها لرفع كفاءة مزرعتك وزيادة أرباحك بكل سهولة.
                    </p>
                </div>
            </div>
        </div>
        </div>
    );
}
