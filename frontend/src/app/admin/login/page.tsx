"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { Icons } from "../../../components/Icons";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { fetchWithAuth, refreshUser } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api-proxy/login?useCookies=true", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                await refreshUser(); // Make sure user context is updated and we get isAdmin
                router.push("/admin");
            } else {
                setError("بيانات الدخول غير صحيحة، أو ليس لديك صلاحية مدير.");
            }
        } catch (err) {
            setError("حدث خطأ في الاتصال بالخادم.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden" dir="rtl">
            {/* Dark mode background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-y-32 -translate-x-32"></div>

            <div className="w-full max-w-md bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                        <Icons.Settings className="w-8 h-8" />
                    </div>
                </div>
                
                <h1 className="text-2xl font-bold text-center text-white mb-2">لوحة الإدارة الشاملة</h1>
                <p className="text-center text-slate-400 mb-8 text-sm">قم بتسجيل الدخول كمدير للنظام</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">البريد الإلكتروني</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500 transition-colors"
                            placeholder="admin@example.com"
                            dir="ltr"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">كلمة المرور</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500 transition-colors"
                            placeholder="••••••••"
                            dir="ltr"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                    >
                        {isLoading ? "جاري الدخول..." : "دخول للإدارة"}
                    </button>
                </form>
            </div>
        </div>
    );
}
