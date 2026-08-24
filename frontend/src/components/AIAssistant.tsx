"use client";

import { useState } from "react";

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'model', text: 'مرحباً! أنا مساعد مزرعتي. كيف يمكنني مساعدتك اليوم في إدارة طيورك أو إنتاجك؟' }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', text: input }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        // Mocking response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'model', text: "تأكد من الحفاظ على درجة حرارة الحضانة عند 37.5 درجة مئوية ورطوبة 60-65% خلال الأيام الـ 18 الأولى لبيض الدجاج." }]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60]" dir="rtl">
            {isOpen && (
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 w-[22rem] sm:w-[24rem] mb-4 flex flex-col h-[32rem] transform origin-bottom-right transition-all animate-in zoom-in-95 duration-200">
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-4 text-white flex justify-between items-center shadow-md rounded-t-3xl">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">مساعد مزرعتي الذكي</h3>
                                <span className="text-xs text-emerald-100 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span> متصل
                                </span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 dark:bg-slate-900/50 flex flex-col gap-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-emerald-500 text-white rounded-br-sm' 
                                    : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-slate-600 rounded-bl-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-end">
                                <div className="bg-white dark:bg-slate-700 px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-100 dark:border-slate-600 shadow-sm flex gap-1.5 items-center">
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 flex gap-2 items-center rounded-b-3xl">
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="اسأل عن أي شيء..." className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-slate-900 border border-transparent focus:border-emerald-500/30 rounded-full text-sm focus:outline-none focus:ring-0 text-gray-800 dark:text-white transition-all"/>
                        <button type="submit" disabled={isLoading || !input.trim()} className="bg-emerald-500 text-white p-2.5 rounded-full hover:bg-emerald-600 disabled:opacity-50 transition-colors flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform -rotate-90 rtl:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </form>
                </div>
            )}
            {!isOpen && (
                <button onClick={() => setIsOpen(true)} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-4 shadow-lg shadow-emerald-500/30 flex items-center justify-center transition-all duration-300 hover:-translate-y-1 group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </button>
            )}
        </div>
    );
}
