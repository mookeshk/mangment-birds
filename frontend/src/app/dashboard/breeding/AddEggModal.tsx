import { useState, useEffect } from "react";

interface AddEggModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    session: any;
}

export default function AddEggModal({ isOpen, onClose, onSave, session }: AddEggModalProps) {
    const [laidDate, setLaidDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLaidDate(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen]);

    if (!isOpen || !session) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Calculate ExpectedHatchDate
        const expectedHatchDate = new Date(laidDate);
        if (session.incubationPeriodInDays) {
            expectedHatchDate.setDate(expectedHatchDate.getDate() + session.incubationPeriodInDays);
        } else {
            // Default fallback if not set on species
            expectedHatchDate.setDate(expectedHatchDate.getDate() + 21);
        }

        try {
            await onSave({
                breedingSessionId: session.id,
                laidDate: laidDate,
                expectedHatchDate: expectedHatchDate.toISOString(),
                status: 0 // EggStatus.Incubating
            });
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        تسجيل بيضة جديدة
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 text-sm mb-4">
                        <p className="font-bold mb-1">الزوج: {session.maleIdentifier} + {session.femaleIdentifier}</p>
                        <p className="text-xs">فترة الحضانة المتوقعة: {session.incubationPeriodInDays || 21} يوم</p>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">تاريخ وضع البيضة</label>
                        <input
                            type="date"
                            required
                            value={laidDate}
                            onChange={e => setLaidDate(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="submit" disabled={isSubmitting} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50">
                            {isSubmitting ? "جاري الحفظ..." : "حفظ البيضة"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
