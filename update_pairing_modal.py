import os
import re

file_path = r"frontend/src/app/dashboard/breeding/PairingModal.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add colonyBirdIds state
content = content.replace(
    'const [cageId, setCageId] = useState("");',
    'const [cageId, setCageId] = useState("");\n    const [colonyBirdIds, setColonyBirdIds] = useState<string[]>([]);'
)

# Reset state when opened
content = content.replace(
    'setMatingDate(new Date().toISOString().split(\'T\')[0]);\n        }\n    }, [isOpen]);',
    'setMatingDate(new Date().toISOString().split(\'T\')[0]);\n            setColonyBirdIds([]);\n        }\n    }, [isOpen]);'
)

# Submit payload
content = content.replace(
    'femaleBirdId: mode === "individual" ? Number(femaleId) : null,',
    'femaleBirdId: mode === "individual" ? Number(femaleId) : null,\n                  colonyBirdIds: mode === "colony" ? colonyBirdIds.map(Number) : undefined,'
)

# Add UI for selecting birds in colony mode
colony_ui_old = '''                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {mode === "colony" ? "القفص أو المطيار" : "القفص المتواجدين فيه (اختياري)"}
                        </label>'''
                        
colony_ui_new = '''                    {mode === "colony" && (
                        <div className="space-y-2 mb-4">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">اختر طيور المطيار (متعدد)</label>
                            <div className="max-h-40 overflow-y-auto bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl p-2 space-y-1">
                                {availableBirds.length === 0 ? (
                                    <div className="text-center text-xs text-gray-500 py-4">لا توجد طيور متاحة.</div>
                                ) : availableBirds.map(b => (
                                    <label key={b.id} className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={colonyBirdIds.includes(b.id.toString())}
                                            onChange={(e) => {
                                                if (e.target.checked) setColonyBirdIds([...colonyBirdIds, b.id.toString()]);
                                                else setColonyBirdIds(colonyBirdIds.filter(id => id !== b.id.toString()));
                                            }}
                                            className="w-4 h-4 text-emerald-500 bg-white border-gray-300 rounded focus:ring-emerald-500 dark:bg-slate-700 dark:border-slate-600"
                                        />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{b.identifier} ({b.speciesName}) - {b.isMale ? 'ذكر' : 'أنثى'}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {mode === "colony" ? "القفص أو المطيار" : "القفص المتواجدين فيه (اختياري)"}
                        </label>'''

content = content.replace(colony_ui_old, colony_ui_new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
