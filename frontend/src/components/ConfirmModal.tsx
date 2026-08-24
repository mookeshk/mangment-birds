"use client";

export default function ConfirmModal({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel,
    confirmText = "تأكيد",
    cancelText = "إلغاء"
}: { 
    isOpen: boolean, 
    title: string, 
    message: string, 
    onConfirm: () => void | Promise<void>, 
    onCancel: () => void,
    confirmText?: string,
    cancelText?: string
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4 text-red-500">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>
                    
                    <div className="flex gap-3 justify-center">
                        <button 
                            onClick={onCancel}
                            className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button 
                            onClick={onConfirm}
                            className="px-4 py-2 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20 transition-colors"
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
