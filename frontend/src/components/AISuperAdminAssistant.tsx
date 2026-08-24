"use client";

import { useState } from 'react';
import { Icons } from './Icons';

export const AISuperAdminAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'model', text: 'مرحباً أيها المدير العام! أنا المساعد الذكي لنظام "مزرعتي". يمكنني مساعدتك في تحليل بيانات المزارع واقتراح تحسينات على الباقات. كيف يمكنني دعمك اليوم؟' }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', text: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            // Mock AI Response
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'model', text: 'بناءً على تحليلات النظام الحالية، تبدو معدلات الاشتراك في تصاعد مستمر. هل أساعدك في صياغة حملة تسويقية أو اقتراح باقة جديدة؟' }]);
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: "عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي." }]);
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50" dir="rtl">
            {isOpen && (
                <div className="bg-white dark:bg-[#1e293b] rounded-3xl shadow-2xl border border-gray-100 dark:border-[#334155] w-[22rem] sm:w-[24rem] mb-4 flex flex-col h-[32rem] transform origin-bottom-right transition-all animate-in fade-in zoom-in">
                    <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 p-4 text-white flex justify-between items-center shadow-md rounded-t-3xl">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                <Icons.Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">مساعد الإدارة العليا</h3>
                                <span className="text-xs text-emerald-100 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span> متصل
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 dark:bg-[#0f172a]/50 flex flex-col gap-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-emerald-600 text-white rounded-br-sm' 
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-end">
                                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-100 dark:border-gray-700 shadow-sm flex gap-1.5 items-center">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSend} className="p-3 bg-white dark:bg-[#1e293b] border-t border-gray-100 dark:border-[#334155] flex gap-2 items-center rounded-b-3xl">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="اسأل المساعد الذكي..." className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-[#0f172a] border border-transparent focus:border-emerald-500/30 rounded-full text-sm focus:outline-none focus:ring-0 text-gray-800 dark:text-white transition-all"/>
                        <button type="submit" disabled={isLoading || !input.trim()} className="bg-emerald-600 text-white p-2.5 rounded-full hover:bg-emerald-700 disabled:opacity-50 transition-colors flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform -rotate-90 rtl:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </form>
                </div>
            )}
            {!isOpen && (
                <button onClick={() => setIsOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl w-14 h-14 shadow-lg shadow-emerald-600/30 flex items-center justify-center transition-transform duration-300 hover:scale-105 focus:outline-none">
                    <Icons.Sparkles className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};
