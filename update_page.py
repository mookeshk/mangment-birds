import os

file_path = r"frontend\src\app\dashboard\breeding\page.tsx"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add Active/History tab state
search1 = "    const [isPairingModalOpen, setIsPairingModalOpen] = useState(false);"
replace1 = search1 + "\n    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');"

# Add handleEndSession
search2 = "    const handleDeletePairing = (id: number) => {"
replace2 = '''    const handleEndPairing = (id: number) => {
        setConfirmState({
            isOpen: true,
            title: "إنهاء دورة التزاوج",
            message: "هل أنت متأكد من إنهاء دورة التزاوج هذه؟ سيتم فك ارتباط الطيور وتصبح متاحة للتزاوج مرة أخرى.",
            action: async () => {
                const res = await fetchWithAuth(/api/breedingsessions//end, {
                    method: 'PUT'
                });
                
                if (res.ok) {
                    if (selectedPairId === id) setSelectedPairId(null);
                    loadData();
                } else {
                    alert("حدث خطأ أثناء الإنهاء");
                }
                setConfirmState(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

''' + search2

# Replace UI tabs
search3 = "                <h3 className=\"text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2\">"
replace3 = '''                <div className="flex flex-col sm:flex-row justify-between items-center w-full mb-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Heart className="w-5 h-5 text-rose-500" />
                        أزواج الطيور
                    </h3>
                    <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
                        <button 
                            onClick={() => setActiveTab('active')}
                            className={px-4 py-2 text-sm font-medium rounded-md transition-colors }
                        >
                            النشطة
                        </button>
                        <button 
                            onClick={() => setActiveTab('history')}
                            className={px-4 py-2 text-sm font-medium rounded-md transition-colors }
                        >
                            سجل التزاوج
                        </button>
                    </div>
                </div>'''

# Remove old heading completely because we replaced it inside replace3
search4 = '''                    <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Heart className="w-5 h-5 text-rose-500" />
                        أزواج الطيور
                    </h3>'''


# Change mapping over breedingPairs
search5 = "                    {breedingPairs.map(pair => ("
replace5 = "                    {breedingPairs.filter(p => activeTab === 'active' ? p.isActive : !p.isActive).map(pair => ("

# Add end button to pairing cards
search6 = '''                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeletePairing(pair.id);
                                            }}'''

replace6 = '''                                        {pair.isActive && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEndPairing(pair.id);
                                                }}
                                                className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors"
                                                title="إنهاء دورة التزاوج"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
                                            </button>
                                        )}
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeletePairing(pair.id);
                                            }}'''

# Add duration text for history
search7 = "                                        {pair.maleIdentifier ? ("
replace7 = '''                                        {!pair.isActive && (
                                            <div className="absolute top-2 right-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">
                                                تاريخ الإنهاء: {new Date(pair.endDate).toLocaleDateString('ar-EG')}
                                            </div>
                                        )}
                                        {pair.maleIdentifier ? ('''

if search1 in content:
    content = content.replace(search1, replace1)
    content = content.replace(search2, replace2)
    content = content.replace(search4, replace3)
    content = content.replace(search5, replace5)
    content = content.replace(search6, replace6)
    content = content.replace(search7, replace7)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated page.tsx")
else:
    print("Could not find search strings")
