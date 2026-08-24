import { useState, useEffect } from "react";

interface PairingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    birds: any[];
    cages?: any[];
}

export default function PairingModal({ isOpen, onClose, onSave, birds, cages = [] }: PairingModalProps) {
    const [mode, setMode] = useState<"individual" | "colony">("individual");
    const [maleId, setMaleId] = useState("");
    const [femaleId, setFemaleId] = useState("");
    const [cageId, setCageId] = useState("");
    const [matingDate, setMatingDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset when opened
    useEffect(() => {
        if (isOpen) {
            setMode("individual");
            setMaleId("");
            setFemaleId("");
            setCageId("");
            setMatingDate(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Only show birds that are Available (0) or Productive (1)
    const availableBirds = birds.filter(b => b.status === 0 || b.status === 1);
    
    const males = availableBirds.filter(b => b.isMale);
    const females = availableBirds.filter(b => !b.isMale);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave({
                maleBirdId: mode === "individual" ? parseInt(maleId) : null,
                femaleBirdId: mode === "individual" ? parseInt(femaleId) : null,
                cageId: cageId ? parseInt(cageId) : null,
                matingDate: matingDate
            });
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        تسجيل تزاوج جديد
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    
                    <div className="flex bg-gray-100 dark:bg-slate-900 p-1 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setMode("individual")}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === "individual" ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            تزاوج فردي (زوج)
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("colony")}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === "colony" ? "bg-white dark:bg-slate-700 text-emerald-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            تفريخ جماعي (مطيار)
                        </button>
                    </div>

                    {mode === "individual" && (
                        <>
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">الذكر</label>
                                <select
                                    required
                                    value={maleId}
                                    onChange={e => setMaleId(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                                >
                                    <option value="" disabled>اختر الذكر...</option>
                                    {males.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.identifier} ({m.speciesName})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">الأنثى</label>
                                <select
                                    required
                                    value={femaleId}
                                    onChange={e => setFemaleId(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                                >
                                    <option value="" disabled>اختر الأنثى...</option>
                                    {females.map(f => (
                                        <option key={f.id} value={f.id}>
                                            {f.identifier} ({f.speciesName})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {mode === "colony" ? "القفص أو المطيار" : "القفص المتواجدين فيه (اختياري)"}
                        </label>
                        <select
                            required={mode === "colony"}
                            value={cageId}
                            onChange={e => setCageId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                        >
                            <option value="" disabled>اختر القفص / المطيار...</option>
                            {cages.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">تاريخ البدء</label>
                        <input
                            type="date"
                            required
                            value={matingDate}
                            onChange={e => setMatingDate(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="submit" disabled={isSubmitting} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50">
                            {isSubmitting ? "جاري الحفظ..." : "تسجيل"}
                        </button>
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-200 py-2.5 rounded-xl font-bold text-sm transition-all">
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
